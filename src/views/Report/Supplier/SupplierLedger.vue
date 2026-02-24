<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

/* UI */
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import ReportMenu from '@/components/inc/SubSidebar/ReportMenu.vue'
import TableSkeleton from '@/components/Skeleton/Table.vue'
import Pagination from '@/components/Pagination.vue'

import { useMessageStore } from '@/stores/useMessageStore'
import { usePagination } from '@/composables/usePagination'

const messageStore = useMessageStore()

/* ===============================
BREADCRUMB
=============================== */

const $breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Supplier Transaction History' }
]

/* ===============================
PAGINATION
=============================== */

const {
  currentPage,
  perPage,
  lastPage,
  setMeta,
  changePage,
} = usePagination(20)

/* ===============================
FILTERS
=============================== */

const fromDate = ref('')
const toDate = ref('')
const supplierId = ref('')
const note = ref('')

/* ===============================
DATA
=============================== */

const loading = ref(false)

const rows = ref<any[]>([])

const totals = ref({
  total_debit: 0,
  total_credit: 0,
  balance: 0,
  closing_balance: 0
})

const openingBalance = ref(0)

/* ===============================
SUPPLIERS
=============================== */

const suppliers = ref([])

const loadSuppliers = async () => {
  try {
    const res = await axiosInstance.get('/suppliers/option/list')
    suppliers.value = res.data.data
  }
  catch {
    messageStore.showError('Supplier load failed')
  }
}

/* ===============================
FETCH REPORT
=============================== */

const fetchReport = async () => {

  loading.value = true

  try {

    const res = await axiosInstance.get('/report/supplier-ledger/get', {

      params: {

        from_date: fromDate.value || undefined,
        to_date: toDate.value || undefined,
        supplier_id: supplierId.value || undefined,
        note: note.value || undefined,

        page: currentPage.value,
        per_page: perPage.value

      }

    })

    rows.value = res.data.data

    totals.value = res.data.totals

    openingBalance.value = res.data.opening_balance

    setMeta(res.data.pagination)

  }
  catch (err) {

    if (err instanceof AxiosError) {

      messageStore.showError(
        err.response?.data?.message || 'Report fetch failed'
      )

    }

  }
  finally {

    loading.value = false

  }

}

/* ===============================
ACTIONS
=============================== */

const handleSearch = () => {

  currentPage.value = 1

  fetchReport()

}

const resetFilters = () => {

  fromDate.value = ''
  toDate.value = ''
  supplierId.value = ''
  note.value = ''

  fetchReport()

}

/* ===============================
PRINT
=============================== */

const printReport = () => {

  window.print()

}

/* ===============================
FORMAT
=============================== */

const formatNumber = (num: number) => {

  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

}

/* ===============================
INIT
=============================== */

onMounted(() => {

  loadSuppliers()

  fetchReport()

})
</script>

<template>

<div class="flex gap-4 print:block">

  <div class="hidden lg:block flex-none print:hidden">
    <ReportMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4">

    <Breadcrumb :items="$breadcrumbs" />

    <!-- Header -->
    <div class="flex justify-between items-center mb-4 print:block">

      <h2 class="text-2xl font-semibold">
        Supplier Transaction History
      </h2>

      <button
        @click="printReport"
        class="print:hidden bg-blue-600 text-white px-4 py-2 rounded"
      >
        Print
      </button>

    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 print:hidden">

      <input type="date" v-model="fromDate" class="border p-2">

      <input type="date" v-model="toDate" class="border p-2">

      <select v-model="supplierId" class="border p-2">

        <option value="">All Suppliers</option>

        <option
          v-for="supplier in suppliers"
          :key="supplier.id"
          :value="supplier.id"
        >
          {{ supplier.name }} - {{ supplier.phone }}
        </option>

      </select>

      <input
        type="text"
        placeholder="Note"
        v-model="note"
        class="border p-2"
      >

    </div>

    <!-- Buttons -->
    <div class="flex gap-2 mb-4 print:hidden">

      <button
        @click="handleSearch"
        class="bg-gray-700 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      <button
        @click="resetFilters"
        class="bg-gray-300 px-4 py-2 rounded"
      >
        Reset
      </button>

    </div>

    <!-- Summary (same design kept) -->
    <div class="grid grid-cols-12 gap-6 mb-10">

      <div class="col-span-12 lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-2xl">

        <p class="text-purple-300 text-xs font-bold uppercase mb-1">
          Closing Balance
        </p>

        <h2 class="text-4xl font-black text-white">
          {{ formatNumber(totals.closing_balance) }}
        </h2>

      </div>

      <div class="col-span-12 lg:col-span-7 grid grid-cols-3 gap-4">

        <div class="bg-white p-5 rounded-3xl border">
          <p class="text-sm text-gray-500">Opening Balance</p>
          <p class="text-xl font-bold">
            {{ formatNumber(openingBalance) }}
          </p>
        </div>

        <div class="bg-white p-5 rounded-3xl border">
          <p class="text-sm text-gray-500">Total Debit</p>
          <p class="text-xl font-bold text-green-600">
            + {{ formatNumber(totals.total_debit) }}
          </p>
        </div>

        <div class="bg-white p-5 rounded-3xl border">
          <p class="text-sm text-gray-500">Total Credit</p>
          <p class="text-xl font-bold text-red-600">
            - {{ formatNumber(totals.total_credit) }}
          </p>
        </div>

      </div>

    </div>

    <!-- Table -->
    <div class="overflow-x-auto">

      <table class="min-w-full border">

        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 text-left">#</th>
            <th class="p-2 text-left">Date</th>
            <th class="p-2 text-left">Type</th>
            <th class="p-2 text-left">Note</th>
            <th class="p-2 text-right">Debit</th>
            <th class="p-2 text-right">Credit</th>
          </tr>
        </thead>

        <tbody>

          <TableSkeleton v-if="loading" :colspan="6" />

          <tr v-for="(row,index) in rows" :key="row.id">

            <td class="p-2">
              {{ (currentPage-1)*perPage + index + 1 }}
            </td>

            <td class="p-2">
              {{ row.transaction_date }}
            </td>

            <td class="p-2">
              {{ row.transaction_type }}
            </td>

            <td class="p-2">
              {{ row.note }}
            </td>

            <td class="p-2 text-right text-green-600">
              {{ formatNumber(row.debit) }}
            </td>

            <td class="p-2 text-right text-red-600">
              {{ formatNumber(row.credit) }}
            </td>

          </tr>

        </tbody>

      </table>

    </div>

    <!-- Pagination -->
    <Pagination
      :current-page="currentPage"
      :last-page="lastPage"
      @change="page => changePage(page, fetchReport)"
    />

  </div>

</div>

</template>