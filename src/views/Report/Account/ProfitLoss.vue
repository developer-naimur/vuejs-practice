<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

/* UI Components */
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import ReportMenu from '@/components/inc/SubSidebar/ReportMenu.vue'

import { useMessageStore } from '@/stores/useMessageStore'

const messageStore = useMessageStore()

/* ===============================
BREADCRUMB
=============================== */
const $breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Profit & Loss Report' }
]

/* ===============================
FILTERS
=============================== */
const fromDate = ref('')
const toDate = ref('')

/* ===============================
DATA
=============================== */
const loading = ref(false)
const report = ref<any>({
  total_sale: 0,
  total_sale_return: 0,
  net_sale: 0,
  total_purchase: 0,
  total_purchase_return: 0,
  net_purchase: 0,
  gross_profit: 0,
  other_income: 0,
  total_expense: 0,
  net_profit: 0,
})

/* ===============================
FETCH REPORT
=============================== */
const fetchReport = async () => {
  loading.value = true

  try {
    const res = await axiosInstance.get('/report/profit-loss/get', {
      params: {
        from_date: fromDate.value || undefined,
        to_date: toDate.value || undefined,
      }
    })

    report.value = res.data.data
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
  fetchReport()
}

const resetFilters = () => {
  fromDate.value = ''
  toDate.value = ''
  fetchReport()
}

/* ===============================
PRINT
=============================== */
const printReport = () => {
  window.print()
}

/* ===============================
FORMAT NUMBERS
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

  <!-- Sidebar -->
  <div class="hidden lg:block flex-none print:hidden">
    <ReportMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4">

    <!-- Breadcrumb -->
    <Breadcrumb :items="$breadcrumbs" />

    <!-- Header -->
    <div class="flex justify-between items-center mb-4 print:block">
      <h2 class="text-2xl font-semibold">Profit & Loss Report</h2>
      <button @click="printReport" class="print:hidden bg-blue-600 text-white px-4 py-2 rounded">Print</button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 print:hidden">
      <input type="date" v-model="fromDate" class="border p-2">
      <input type="date" v-model="toDate" class="border p-2">
    </div>

    <div class="flex gap-2 mb-4 print:hidden">
      <button @click="handleSearch" class="bg-gray-700 text-white px-4 py-2 rounded">Search</button>
      <button @click="resetFilters" class="bg-gray-300 px-4 py-2 rounded">Reset</button>
	</div>

	<!-- Summery -->
<div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8 relative">
      
      <div v-if="loading" class="absolute top-0 left-0 w-full h-1 bg-blue-100 overflow-hidden">
        <div class="w-full h-full bg-blue-600 animate-progress origin-left"></div>
      </div>

      <div class="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-800">Financial Summary Statement</h3>
        <span v-if="loading" class="text-xs font-medium text-blue-600 animate-pulse uppercase">Fetching Data...</span>
      </div>

      <div class="divide-y divide-gray-100">
        
        <div class="p-0">
          <div class="px-6 py-3 bg-blue-50/30 font-black text-[10px] uppercase tracking-widest text-blue-600">
            Operating Revenue
          </div>
          
          <div class="flex justify-between items-center px-8 py-5">
            <p class="text-gray-600 font-medium">Net Sales</p>
            <div v-if="loading" class="h-7 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
            <h2 v-else class="text-xl font-bold text-gray-900">{{ formatNumber(report.net_sale) }}</h2>
          </div>

          <div class="flex justify-between items-center px-8 py-5">
            <p class="text-gray-600 font-medium">Net Purchase</p>
            <div v-if="loading" class="h-7 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
            <h2 v-else class="text-xl font-bold text-gray-900">({{ formatNumber(report.net_purchase) }})</h2>
          </div>
        </div>

        <div class="flex justify-between items-center px-8 py-6 bg-slate-50 border-y border-gray-100">
          <p class="text-gray-800 font-bold text-lg uppercase">Gross Profit</p>
          <div v-if="loading" class="h-9 w-40 bg-blue-100 animate-pulse rounded-lg"></div>
          <h2 v-else class="text-2xl font-black text-blue-700 underline decoration-double decoration-blue-200 underline-offset-8">
            {{ formatNumber(report.gross_profit) }}
          </h2>
        </div>

        <div class="p-0">
          <div class="px-6 py-3 bg-emerald-50/30 font-black text-[10px] uppercase tracking-widest text-emerald-600">
            Other Adjustments
          </div>

          <div class="flex justify-between items-center px-8 py-5">
            <p class="text-gray-600 font-medium pl-5">Other Income</p>
            <div v-if="loading" class="h-7 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
            <h2 v-else class="text-xl font-bold text-emerald-600">+ {{ formatNumber(report.other_income) }}</h2>
          </div>

          <div class="flex justify-between items-center px-8 py-5">
            <p class="text-gray-600 font-medium pl-5">Total Operating Expenses</p>
            <div v-if="loading" class="h-7 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
            <h2 v-else class="text-xl font-bold text-rose-500">- {{ formatNumber(report.total_expense) }}</h2>
          </div>
        </div>

        <div :class="loading ? 'bg-gray-300' : (report.net_profit >= 0 ? 'bg-emerald-600' : 'bg-rose-600')" 
             class="flex justify-between items-center px-8 py-7 text-white transition-all duration-500">
          <div>
            <h2 class="text-xl font-black uppercase tracking-widest">Net Profit</h2>
            <p class="text-[10px] opacity-80 uppercase tracking-tighter">After all taxes and deductions</p>
          </div>
          <div v-if="loading" class="h-10 w-48 bg-white/20 animate-pulse rounded-lg"></div>
          <h2 v-else class="text-4xl font-black tracking-tighter">{{ formatNumber(report.net_profit) }}</h2>
        </div>
      </div>
    </div>

  </div>
</div>
</template>

<style scoped>
@keyframes progress {
  0% { transform: scaleX(0); }
  50% { transform: scaleX(0.5); }
  100% { transform: scaleX(1); }
}
.animate-progress {
  animation: progress 1s infinite linear;
}
</style>