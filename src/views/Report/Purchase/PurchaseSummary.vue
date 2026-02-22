<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
  { label: 'Purchase Report' }
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
const invoiceNo = ref('')
const statusValue = ref('')


/* ===============================
DATA
=============================== */

const loading = ref(false)

const rows = ref<any[]>([])

const totals = ref({
  sub_total: 0,
  discount_amount: 0,
  tax_amount: 0,
  grand_total: 0,
  paid_amount: 0,
  due_amount: 0
})

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

    const res = await axiosInstance.get('/report/purchase-summary/get', {

      params: {

        from_date: fromDate.value || undefined,
        to_date: toDate.value || undefined,
        supplier_id: supplierId.value || undefined,
        invoice_no: invoiceNo.value || undefined,
        status: statusValue.value || undefined,

        page: currentPage.value,
        per_page: perPage.value

      }

    })

    rows.value = res.data.data

    totals.value = res.data.totals

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
  invoiceNo.value = ''
  statusValue.value = ''

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

  //loadSuppliers()

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
        Purchase Report
      </h2>

      <button
        @click="printReport"
        class="print:hidden bg-blue-600 text-white px-4 py-2 rounded"
      >
        Print
      </button>

    </div>



    <!-- Filters -->

    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 print:hidden">

      <input type="date" v-model="fromDate"
        class="border p-2">

      <input type="date" v-model="toDate"
        class="border p-2">

      <!-- <select v-model="supplierId" class="border p-2">

        <option value="">All Suppliers</option>

        <option
          v-for="supplier in suppliers"
          :key="supplier.id"
          :value="supplier.id"
        >
          {{ supplier.name }}

        </option>

      </select> -->

      <input
        type="text"
        placeholder="Invoice no"
        v-model="invoiceNo"
        class="border p-2"
      >

      <select v-model="statusValue" class="border p-2">

        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="cancelled">Cancelled</option>

      </select>

    </div>


    <!-- Filter buttons -->

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




    <!-- TOTAL SUMMARY -->
<div class="grid grid-cols-12 gap-6 mb-10">

  <div class="col-span-12 lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
    <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 opacity-10 rounded-full"></div>
    
    <div class="relative z-10 flex flex-col h-full justify-between">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">Total Payable</p>
          <h2 class="text-4xl font-black text-white tracking-tight">{{ formatNumber(totals.grand_total) }}</h2>
        </div>
        <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
          <svg class="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="org.w3.2000.svg.path..."></path><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
      </div>

      <div class="mt-8 flex gap-4">
        <div class="flex-1 bg-white/5 rounded-2xl p-3 border border-white/10">
          <p class="text-gray-400 text-[10px] uppercase font-bold mb-1">Total Paid</p>
          <p class="text-green-400 font-bold text-lg">{{ formatNumber(totals.paid_amount) }}</p>
        </div>
        <div class="flex-1 bg-white/5 rounded-2xl p-3 border border-white/10">
          <p class="text-gray-400 text-[10px] uppercase font-bold mb-1">Due Remaining</p>
          <p class="text-red-400 font-bold text-lg">{{ formatNumber(totals.due_amount) }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
    
    <div class="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all duration-300">
      <div class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
        <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
      </div>
      <p class="text-sm font-medium text-gray-500">Sub Total</p>
      <p class="text-xl font-bold text-gray-800 mt-1">{{ formatNumber(totals.sub_total) }}</p>
    </div>

    <div class="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-orange-200 transition-all duration-300">
      <div class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-orange-50 transition-colors">
        <svg class="w-5 h-5 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
      </div>
      <p class="text-sm font-medium text-gray-500">Savings</p>
      <p class="text-xl font-bold text-orange-600 mt-1">- {{ formatNumber(totals.discount_amount) }}</p>
    </div>

    <div class="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-purple-200 transition-all duration-300">
      <div class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-purple-50 transition-colors">
        <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
      </div>
      <p class="text-sm font-medium text-gray-500">Tax Detail</p>
      <p class="text-xl font-bold text-purple-600 mt-1">+ {{ formatNumber(totals.tax_amount) }}</p>
    </div>

  </div>
</div>

    <!-- Table -->
    <div class="overflow-x-auto">

      <table class="min-w-full border border-gray-200 divide-y divide-gray-200">

        <thead class="bg-gray-100">

          <tr>

            <th class="p-2 text-left">#</th>
            <th class="p-2 text-left">Date</th>
            <th class="p-2 text-left">Invoice</th>

            <th class="p-2 text-right">Sub Total</th>
            <th class="p-2 text-right">Discount</th>
            <th class="p-2 text-right">Tax</th>

            <th class="p-2 text-right">Grand Total</th>
            <th class="p-2 text-right">Paid</th>
            <th class="p-2 text-right">Due</th>

          </tr>

        </thead>


        <tbody>

          <TableSkeleton v-if="loading" :colspan="9" />

          <tr v-for="(row,index) in rows" :key="row.id">

            <td class="p-2">
              {{ (currentPage-1)*perPage + index + 1 }}
            </td>

            <td class="p-2">
              {{ row.purchase_date }}
            </td>

            <td class="p-2">
              {{ row.invoice_no }}
            </td>

            <td class="p-2 text-right">
              {{ formatNumber(row.sub_total) }}
            </td>

            <td class="p-2 text-right">
              {{ formatNumber(row.discount_amount) }}
            </td>

            <td class="p-2 text-right">
              {{ formatNumber(row.tax_amount) }}
            </td>

            <td class="p-2 text-right font-semibold">
              {{ formatNumber(row.grand_total) }}
            </td>

            <td class="p-2 text-right text-green-600">
              {{ formatNumber(row.paid_amount) }}
            </td>

            <td class="p-2 text-right text-red-600">
              {{ formatNumber(row.due_amount) }}
            </td>

          </tr>

        </tbody>

      </table>

    </div>



    <!-- Pagination -->

    <div class="print:hidden">

      <Pagination
        :current-page="currentPage"
        :last-page="lastPage"
        @change="page => changePage(page, fetchReport)"
      />

    </div>



  </div>

</div>

</template>



<style>

@media print {

  body {

    background: white;

  }

}

</style>