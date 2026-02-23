<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

/* UI Components */
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
  { label: 'Top Suppliers Report' }
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
const name = ref('')
const phone = ref('')
const statusValue = ref('')

/* ===============================
DATA
=============================== */
const loading = ref(false)
const rows = ref<any[]>([])
const totals = ref({ total_purchase: 0 })

/* ===============================
FETCH REPORT
=============================== */
const fetchReport = async () => {
  loading.value = true

  try {
    const res = await axiosInstance.get('/report/top-supplier/get', {
      params: {
        name: name.value || undefined,
        phone: phone.value || undefined,
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
      messageStore.showError(err.response?.data?.message || 'Supplier due fetch failed')
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
  name.value = ''
  phone.value = ''
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
        Top Suppliers Report
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
      <input type="text" placeholder="Name" v-model="name" class="border p-2" />
      <input type="text" placeholder="Phone" v-model="phone" class="border p-2" />
    </div>
    <!-- Filter Buttons -->
    <div class="flex gap-2 mb-4 print:hidden">
      <button @click="handleSearch" class="bg-gray-700 text-white px-4 py-2 rounded">Search</button>
      <button @click="resetFilters" class="bg-gray-300 px-4 py-2 rounded">Reset</button>
    </div>

    <!-- Total Purchase -->
    <div class="grid grid-cols-12 gap-6 mb-10">
      <div class="col-span-12 lg:col-span-4 bg-gradient-to-br from-slate-900 to-indigo-900 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-slate-400 opacity-10 rounded-full"></div>
        
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-slate-300 text-xs font-bold uppercase tracking-widest mb-1">Total Purchase</p>
              <h2 class="text-4xl font-black text-white tracking-tight">{{ formatNumber(totals.total_purchase) }}</h2>
            </div>
            
            <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 text-left">#</th>
            <th class="p-2 text-left">Name</th>
            <th class="p-2 text-left">Phone</th>
            <th class="p-2 text-right">Total Purchase</th>
            <!-- <th class="p-2 text-right">Total Paid</th> -->
            <!-- <th class="p-2 text-right">Total Due</th> -->
            <th class="p-2 text-left">Last Purchase Date</th>
          </tr>
        </thead>

        <tbody>
          <TableSkeleton v-if="loading" :colspan="9" />

          <tr v-for="(row,index) in rows" :key="row.id">
            <td class="p-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="p-2">{{ row.name }}</td>
            <td class="p-2">{{ row.phone }}</td>
            <td class="p-2 text-right">{{ formatNumber(row.total_purchase) }}</td>
            <!-- <td class="p-2 text-right text-green-600">{{ formatNumber(row.total_paid) }}</td> -->
            <!-- <td class="p-2 text-right text-red-600">{{ formatNumber(row.total_sale) }}</td> -->
            <td class="p-2">{{ row.last_purchase_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="print:hidden mt-4">
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