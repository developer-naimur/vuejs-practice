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
  { label: 'Stock Adjustment Report' }
]

/* ===============================
PAGINATION
=============================== */
const { currentPage, perPage, lastPage, setMeta, changePage } = usePagination(20)

/* ===============================
FILTERS
=============================== */
const warehouseId = ref('')
const fromDate = ref('')
const toDate = ref('')
const operationType = ref('')
const direction = ref('')
const partyType = ref('')
const customerId = ref('')
const supplierId = ref('')
const statusValue = ref('')

/* ===============================
DATA
=============================== */
const loading = ref(false)
const rows = ref<any[]>([])
const totals = ref({
  total_cost: 0,
  total_sold: 0,
  payment_amount: 0
})

/* ===============================
FETCH REPORT
=============================== */
const fetchReport = async () => {
  loading.value = true
  try {
    const res = await axiosInstance.get('/report/stock-adjustment/get', {
      params: {
        warehouse_id: warehouseId.value || undefined,
        from_date: fromDate.value || undefined,
        to_date: toDate.value || undefined,
        operation_type: operationType.value || undefined,
        direction: direction.value || undefined,
        party_type: partyType.value || undefined,
        customer_id: customerId.value || undefined,
        supplier_id: supplierId.value || undefined,
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
      messageStore.showError(err.response?.data?.message || 'Report fetch failed')
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
  warehouseId.value = ''
  fromDate.value = ''
  toDate.value = ''
  operationType.value = ''
  direction.value = ''
  partyType.value = ''
  customerId.value = ''
  supplierId.value = ''
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
      <h2 class="text-2xl font-semibold">Stock Adjustment Report</h2>
      <button @click="printReport" class="print:hidden bg-blue-600 text-white px-4 py-2 rounded">Print</button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 print:hidden">
      <input type="date" v-model="fromDate" class="border p-2">
      <input type="date" v-model="toDate" class="border p-2">

      <select v-model="operationType" class="border p-2">
        <option value="">All Types</option>
        <option value="adjustment">Adjustment</option>
        <option value="damage">Damage</option>
        <option value="free">Free</option>
        <option value="return">Return</option>
        <option value="lost">Lost</option>
      </select>

      <select v-model="direction" class="border p-2">
        <option value="">All Directions</option>
        <option value="in">In</option>
        <option value="out">Out</option>
      </select>

      <select v-model="statusValue" class="border p-2">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    <div class="flex gap-2 mb-4 print:hidden">
      <button @click="handleSearch" class="bg-gray-700 text-white px-4 py-2 rounded">Search</button>
      <button @click="resetFilters" class="bg-gray-300 px-4 py-2 rounded">Reset</button>
    </div>

    <!-- TOTAL SUMMARY -->
	<div class="grid grid-cols-12 gap-6 mb-10">

	  <div class="col-span-12 lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
	    <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 opacity-10 rounded-full"></div>
	    <div class="relative z-10 flex flex-col h-full justify-between">
	      <div class="flex justify-between items-start">
	        <div>
	          <p class="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">Total Cost</p>
	          <h2 class="text-4xl font-black text-white tracking-tight">{{ formatNumber(totals.total_cost) }}</h2>
	        </div>
	        <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
	          <svg class="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
	            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
	          </svg>
	        </div>
	      </div>
	    </div>
	  </div>

	  <div class="col-span-12 lg:col-span-4 bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
	    <div class="absolute -right-10 -top-10 w-40 h-40 bg-green-500 opacity-10 rounded-full"></div>
	    <div class="relative z-10 flex flex-col h-full justify-between">
	      <div class="flex justify-between items-start">
	        <div>
	          <p class="text-green-300 text-xs font-bold uppercase tracking-widest mb-1">Total Sold</p>
	          <h2 class="text-4xl font-black text-white tracking-tight">{{ formatNumber(totals.total_sold) }}</h2>
	        </div>
	        <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
	          <svg class="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
	            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
	          </svg>
	        </div>
	      </div>
	    </div>
	  </div>

	  <div class="col-span-12 lg:col-span-4 bg-gradient-to-br from-orange-900 to-orange-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
	    <div class="absolute -right-10 -top-10 w-40 h-40 bg-orange-500 opacity-10 rounded-full"></div>
	    <div class="relative z-10 flex flex-col h-full justify-between">
	      <div class="flex justify-between items-start">
	        <div>
	          <p class="text-orange-300 text-xs font-bold uppercase tracking-widest mb-1">Total Payment</p>
	          <h2 class="text-4xl font-black text-white tracking-tight">{{ formatNumber(totals.payment_amount) }}</h2>
	        </div>
	        <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
	          <svg class="w-6 h-6 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
	            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
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
            <th class="p-2 text-left">Date</th>
            <th class="p-2 text-left">Type</th>
            <th class="p-2 text-left">Direction</th>
            <th class="p-2 text-left">Party</th>
            <th class="p-2 text-right">Cost</th>
            <th class="p-2 text-right">Sold</th>
            <th class="p-2 text-right">Payment</th>
            <th class="p-2 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          <TableSkeleton v-if="loading" :colspan="9" />
          <tr v-for="(row,index) in rows" :key="row.id">
            <td class="p-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="p-2">{{ row.operation_date }}</td>
            <td class="p-2">{{ row.operation_type }}</td>
            <td class="p-2">{{ row.direction }}</td>
            <td class="p-2">{{ row.party_type }}</td>
            <td class="p-2 text-right">{{ formatNumber(row.total_cost) }}</td>
            <td class="p-2 text-right">{{ formatNumber(row.total_sold) }}</td>
            <td class="p-2 text-right">{{ formatNumber(row.payment_amount) }}</td>
            <td class="p-2">{{ row.status }}</td>
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