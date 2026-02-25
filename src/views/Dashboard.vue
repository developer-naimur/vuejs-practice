<script setup lang="ts">

import TableSkeleton from '@/components/Skeleton/Table.vue'
import DashboardCardSkeleton from '@/components/Skeleton/SmCard.vue'
import ApexChart from 'vue3-apexcharts'
import { ref, watch, reactive, onMounted, computed } from 'vue'
import moment from 'moment'
import axiosInstance from '@/axiosInstance';

/* ================= DATE FILTER ================= */
const dateFilter = ref<'today'|'week'|'month'|'year'|'custom'>('today')
const fromDate = ref<string|null>(null)
const toDate = ref<string|null>(null)

/* ================= LOADING ================= */
const loading = ref(true)

/* ================= FORMAT FUNCTION ================= */
const formatMoney = (amount: number) => {
  return '৳ ' + amount.toLocaleString()
}

/* ================= API DATA ================= */
const summary = ref({
  total_sale: 0,
  total_sale_return: 0,
  total_purchase: 0,
  total_purchase_return: 0,
  other_income: 0,
  other_expense: 0,
  total_account_balance: 0,
  net_profit: 0
})

/* ================= FETCH FUNCTION ================= */
const fetchDashboard = async () => {
  loading.value = true

  try {
    const { data } = await axiosInstance.get('/dashboard-card-summary', {
      params: {
        filter: dateFilter.value,
        from_date: fromDate.value,
        to_date: toDate.value
      }
    })

    summary.value = data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

/* ================= WATCH FILTER ================= */
watch([dateFilter, fromDate, toDate], () => {
  if (dateFilter.value !== 'custom' || (fromDate.value && toDate.value)) {
    fetchDashboard()
  }
})

const stockSummary = ref({
  total_stock_qty: 0,
  total_stock_value: 0
})
const fetchStockSummary = async () => {
  try {
    const { data } = await axiosInstance.get('/dashboard-stock-summary')
    stockSummary.value = data.data
  } catch (e) {
    console.error(e)
  }
}


/* ================= KPI CARDS ================= */
const kpiCards = computed(() => [
  {
    title: 'Total Sales',
    value: formatMoney(summary.value.total_sale),
    bg: 'bg-white',
    border: 'border-l-4 border-blue-500',
    text: 'text-blue-600'
  },
  {
    title: 'Sales Return',
    value: formatMoney(summary.value.total_sale_return),
    bg: 'bg-white',
    border: 'border-l-4 border-red-500',
    text: 'text-red-600'
  },
  {
    title: 'Total Purchase',
    value: formatMoney(summary.value.total_purchase),
    bg: 'bg-white',
    border: 'border-l-4 border-indigo-500',
    text: 'text-indigo-600'
  },
  {
    title: 'Purchase Return',
    value: formatMoney(summary.value.total_purchase_return),
    bg: 'bg-white',
    border: 'border-l-4 border-pink-500',
    text: 'text-pink-600'
  },
  {
    title: 'Other Income',
    value: formatMoney(summary.value.other_income),
    bg: 'bg-white',
    border: 'border-l-4 border-teal-500',
    text: 'text-teal-600'
  },
  {
    title: 'Other Expense',
    value: formatMoney(summary.value.other_expense),
    bg: 'bg-white',
    border: 'border-l-4 border-yellow-500',
    text: 'text-yellow-600'
  },
  {
    title: 'Account Balance',
    value: formatMoney(summary.value.total_account_balance),
    bg: 'bg-white',
    border: 'border-l-4 border-green-500',
    text: 'text-green-600'
  },
    {
    title: 'Net Profit',
    value: formatMoney(summary.value.net_profit),
    bg: 'bg-white',
    border: 'border-l-4 border-emerald-500',
    text: summary.value.net_profit >= 0
          ? 'text-emerald-600'
          : 'text-red-600'
  },
  {
    title: 'Total Stock Qty ( Fixed )',
    value: stockSummary.value.total_stock_qty.toLocaleString(),
    bg: 'bg-white',
    border: 'border-l-4 border-purple-500',
    text: 'text-purple-600'
  },
  {
    title: 'Total Stock Amount ( Fixed )',
    value: formatMoney(stockSummary.value.total_stock_value),
    bg: 'bg-white',
    border: 'border-l-4 border-teal-500',
    text: 'text-teal-600'
  },
])

/* ================= CHART DATA ================= */


// -------------------- Chart Data --------------------
// -------------------- Week State --------------------
const currentWeekStart = ref(moment().startOf('week'))
const currentWeekEnd   = ref(moment().endOf('week'))

const displayedWeekStart = ref(currentWeekStart.value.clone())
const displayedWeekEnd   = ref(currentWeekEnd.value.clone())

// ---------------- Loading State ----------------
const salesReturnloading = ref(false)
const salesReturnActiveBtn = ref<'prev'|'current'|'next'|null>(null)

const salesReturnSeries = ref([
  { name: 'Sales', data: [] },
  { name: 'Return', data: [] }
])
const salesReturnCategories = ref<string[]>([])

const salesReturnOptions = reactive({
  chart: { toolbar: { show: false } },
  xaxis: { categories: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] },
  colors: ['#2563eb', '#dc2626'],
  legend: { position: 'top' }
})

// -------------------- Fetch Function --------------------
const fetchSalesReturn = async () => {
  salesReturnloading.value = true
  try {
    const { data } = await axiosInstance.get('/dashboard-sales-return-chart', {
      params: {
        week_start: displayedWeekStart.value.format('YYYY-MM-DD'),
        week_end: displayedWeekEnd.value.format('YYYY-MM-DD')
      }
    })

    salesReturnCategories.value = data.data.map(d => d.day_name)
    salesReturnSeries.value = [
      { name: 'Sales', data: data.data.map(d => d.total_sale) },
      { name: 'Return', data: data.data.map(d => d.total_return) }
    ]

    salesReturnOptions.xaxis.categories = salesReturnCategories.value
  } catch (err) {
    console.error(err)
  } finally {
    salesReturnloading.value = false
    salesReturnActiveBtn.value = null
  }
}


// -------------------- Week Navigation --------------------
const prevWeek = () => {
  displayedWeekStart.value = displayedWeekStart.value.clone().subtract(1, 'week')
  displayedWeekEnd.value = displayedWeekEnd.value.clone().subtract(1, 'week')
  fetchSalesReturn()
}

const nextWeek = () => {
  displayedWeekStart.value = displayedWeekStart.value.clone().add(1, 'week')
  displayedWeekEnd.value = displayedWeekEnd.value.clone().add(1, 'week')
  fetchSalesReturn()
}

const resetCurrentWeek = () => {
  displayedWeekStart.value = currentWeekStart.value.clone()
  displayedWeekEnd.value = currentWeekEnd.value.clone()
  fetchSalesReturn()
}

/*const profitLossSeries = [
  { name: 'Profit', data: [5000,6200,7200,6800,8000,9000,10000] },
  { name: 'Loss', data: [1200,800,900,700,600,500,400] }
]
const profitLossOptions = {
  chart: { toolbar: { show: false } },
  stroke: { curve: 'smooth' },
  xaxis: { categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  colors: ['#16a34a','#dc2626'],
  legend: { position: 'top' }
}*/


// --------------------Profit vs Loss Chart Data --------------------
const profitLossLoading = ref(false)
const profitLossActiveBtn = ref<'prev'|'current'|'next'|null>(null)

const profitLossSeries = ref([
  { name: 'Profit', data: [] },
  { name: 'Loss', data: [] }
])
const profitLossCategories = ref<string[]>([])

const profitLossOptions = reactive({
  chart: { toolbar: { show: false } },
  stroke: { curve: 'smooth' },
  xaxis: { categories: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] },
  colors: ['#16a34a','#dc2626'],
  legend: { position: 'top' }
})

// -------------------- Week Navigation --------------------
const profitLossCurrentWeekStart = ref(moment().startOf('week'))
const profitLossCurrentWeekEnd   = ref(moment().endOf('week'))
const profitLossDisplayedStart   = ref(profitLossCurrentWeekStart.value.clone())
const profitLossDisplayedEnd     = ref(profitLossCurrentWeekEnd.value.clone())

const fetchProfitLoss = async () => {
  profitLossLoading.value = true
  try {
    const { data } = await axiosInstance.get('/dashboard-profit-loss-chart', {
      params: {
        week_start: profitLossDisplayedStart.value.format('YYYY-MM-DD'),
        week_end: profitLossDisplayedEnd.value.format('YYYY-MM-DD')
      }
    })

    profitLossCategories.value = data.data.map(d => d.day_name)
    profitLossSeries.value = [
      { name: 'Profit', data: data.data.map(d => d.profit) },
      { name: 'Loss', data: data.data.map(d => d.loss) }
    ]

    profitLossOptions.xaxis.categories = profitLossCategories.value
  } catch (err) {
    console.error(err)
  } finally {
    profitLossLoading.value = false
    profitLossActiveBtn.value = null
  }
}

const prevProfitWeek = () => {
  profitLossDisplayedStart.value = profitLossDisplayedStart.value.clone().subtract(1, 'week')
  profitLossDisplayedEnd.value = profitLossDisplayedEnd.value.clone().subtract(1, 'week')
  fetchProfitLoss()
}

const nextProfitWeek = () => {
  profitLossDisplayedStart.value = profitLossDisplayedStart.value.clone().add(1, 'week')
  profitLossDisplayedEnd.value = profitLossDisplayedEnd.value.clone().add(1, 'week')
  fetchProfitLoss()
}

const resetProfitCurrentWeek = () => {
  profitLossDisplayedStart.value = profitLossCurrentWeekStart.value.clone()
  profitLossDisplayedEnd.value = profitLossCurrentWeekEnd.value.clone()
  fetchProfitLoss()
}



/* ================= LOW STOCK STATE ================= */

/* ===============================
  PAGINATION (GLOBAL)
================================ */

import Pagination from '@/components/Pagination.vue'
import { usePagination } from '@/composables/usePagination'
const {
  currentPage,
  perPage,
  lastPage,
  setMeta,
  changePage,
} = usePagination(10)

const lowStockLoading = ref(false)

const lowStock = ref<any[]>([])
const totalRows = ref<number>(0)


/* ================= LOW STOCK FILTERS ================= */
const lowStockFilters = reactive({
  category_id: null as number | null,
  brand_id: null as number | null,
  product_name: ''
})
const fetchLowStock = async () => {
  lowStockLoading.value = true
  try {
    const response = await axiosInstance.get('/report/low-stock-alert/get', {
      params: {
        category_id: lowStockFilters.category_id,
        brand_id: lowStockFilters.brand_id,
        product_name: lowStockFilters.product_name,
        page: currentPage.value,
        per_page: perPage.value,
      }
    })

    lowStock.value = response.data.data
    totalRows.value = response.data.meta.total
    setMeta(response.data.meta)

  } catch (e) {
    console.error(e)
  } finally {
    lowStockLoading.value = false
  }
}
const getStockStatus = (qty: number) => {
  if (qty <= 0) return 'Out'
  if (qty <= 5) return 'Critical'
  if (qty <= 10) return 'Warning'
  return 'Normal'
}

const handleSearch = () => {
  currentPage.value = 1
  fetchLowStock()
}

const resetFilters = () => {
  lowStockFilters.category_id = null
  lowStockFilters.brand_id = null
  lowStockFilters.product_name = ''

  currentPage.value = 1
  fetchLowStock()
}


const brands = ref([])
const brandLoading = ref<boolean>(false);
const loadBrands = async () => {
  loading.value = true
  brandLoading.value = true
  try {
    const res = await axiosInstance.get('/product-brands/option/list')
    brands.value = res.data.data
  } catch (err) {
    messageStore.showError('Brand load failed. Please check permission.')
  } finally {
    brandLoading.value = false
    loading.value = false
  }
}

const categories = ref([])
const categoryLoading = ref<boolean>(false);
const loadCategories = async () => {
  loading.value = true
  categoryLoading.value = true
  try {
    const res = await axiosInstance.get('/product-categories/option/list')
    categories.value = res.data.data
  } catch (err) {
    messageStore.showError('Category load failed. Please check permission.')
  } finally {
    categoryLoading.value = false
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboard()
  fetchStockSummary()
  fetchSalesReturn()
  fetchProfitLoss()
  fetchLowStock()
  loadBrands()
  loadCategories()
})
</script>

<script lang="ts">
export default {
  components: {
    apexchart: ApexChart
  }
}
</script>



<template>
  <div class="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-900">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-800">Business Dashboard</h1>
        <p class="text-slate-500 font-medium">Real-time overview of your business performance</p>
      </div>

      <div class="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
        <div class="relative group">
          <select
            v-model="dateFilter"
            class="appearance-none bg-slate-100 border-none rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">📅 Custom Range</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        <div v-if="dateFilter === 'custom'" class="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
          <input type="date" v-model="fromDate" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none" />
          <span class="text-slate-400 font-bold">to</span>
          <input type="date" v-model="toDate" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-10">
      <DashboardCardSkeleton v-if="loading" :cardNumber="10" />

      <div v-else
           v-for="(card, index) in kpiCards"
           :key="index"
           class="group relative p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        <div :class="['absolute top-0 left-0 w-1 h-full', card.border.replace('border-l-4', 'bg-').split(' ')[1]]"></div>
        
        <div class="flex flex-col h-full justify-between">
          <div class="flex justify-between items-start mb-4">
            <p class="text-xs font-bold uppercase tracking-widest text-slate-400">{{ card.title }}</p>
            <div :class="['p-2 rounded-lg bg-opacity-10', card.text.replace('text-', 'bg-')]">
               <svg class="w-4 h-4" :class="card.text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
          </div>
          <h2 :class="['text-2xl font-black tracking-tight', card.text]">{{ card.value }}</h2>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div class="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-50 rounded-lg text-blue-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></div>
            <h3 class="text-lg font-bold text-slate-800">Sales vs Return</h3>
          </div>
          <div class="inline-flex bg-slate-100 p-1 rounded-xl shadow-inner">
            <button @click="prevWeek" :disabled="salesReturnloading" class="chart-nav-btn">Prev</button>
            <button @click="resetCurrentWeek" :disabled="salesReturnloading" class="chart-nav-btn bg-white shadow-sm text-blue-600 px-4">Current</button>
            <button @click="nextWeek" :disabled="salesReturnloading" class="chart-nav-btn">Next</button>
          </div>
        </div>
        <div class="relative min-h-[300px]">
           <div v-if="salesReturnloading" class="absolute inset-0 z-10 bg-white/50 flex items-center justify-center backdrop-blur-[2px]">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
           </div>
           <apexchart type="bar" height="320" :options="salesReturnOptions" :series="salesReturnSeries" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div class="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-50 rounded-lg text-emerald-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg></div>
            <h3 class="text-lg font-bold text-slate-800">Profit vs Loss</h3>
          </div>
          <div class="inline-flex bg-slate-100 p-1 rounded-xl shadow-inner">
            <button @click="prevProfitWeek" :disabled="profitLossLoading" class="chart-nav-btn">Prev</button>
            <button @click="resetProfitCurrentWeek" :disabled="profitLossLoading" class="chart-nav-btn bg-white shadow-sm text-emerald-600 px-4 text-xs font-bold">Current</button>
            <button @click="nextProfitWeek" :disabled="profitLossLoading" class="chart-nav-btn">Next</button>
          </div>
        </div>
        <div class="relative min-h-[300px]">
           <div v-if="profitLossLoading" class="absolute inset-0 z-10 bg-white/50 flex items-center justify-center backdrop-blur-[2px]">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
           </div>
           <apexchart type="line" height="320" :options="profitLossOptions" :series="profitLossSeries" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div class="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 class="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Low Stock Alerts
            <span class="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </h3>
          <p class="text-sm text-slate-500 font-medium">System identified {{ totalRows }} items below threshold</p>
        </div>
        
        <div class="flex flex-wrap gap-3 items-center">
            <input
              v-model="lowStockFilters.product_name"
              type="text"
              placeholder="Search product..."
              class="px-4 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-w-[200px]"
            />
            <select v-model="lowStockFilters.category_id" class="px-4 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                <option :value="null">Categories</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.category_name }}</option>
            </select>
            <button @click="handleSearch" class="bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-900 transition active:scale-95 shadow-lg shadow-slate-200">
               Filter
            </button>
            <button @click="resetFilters" class="p-2 text-slate-400 hover:text-red-500 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-slate-400 text-[11px] uppercase tracking-[0.15em] font-black border-b border-slate-50">
              <th class="px-8 py-5">Product Info</th>
              <th class="px-6 py-5">Category & Brand</th>
              <th class="px-6 py-5 text-center">Stock Level</th>
              <th class="px-8 py-5 text-right">Action Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <template v-if="lowStockLoading">
              <TableSkeleton :colspan="5" />
            </template>

            <tr v-else-if="lowStock.length === 0" class="hover:bg-slate-50 transition">
              <td colspan="5" class="px-8 py-16 text-center">
                <div class="flex flex-col items-center opacity-30">
                  <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                  <p class="font-bold">Inventory is healthy!</p>
                </div>
              </td>
            </tr>

            <tr v-else v-for="item in lowStock" :key="item.id" class="group hover:bg-blue-50/30 transition-colors duration-200">
              <td class="px-8 py-5">
                <p class="font-bold text-slate-800 group-hover:text-blue-700 transition">{{ item.product?.name }}</p>
                <p class="text-xs text-slate-400 font-mono tracking-tighter">{{ item.product?.sku || 'NO-SKU' }}</p>
              </td>
              <td class="px-6 py-5">
                <div class="flex gap-2">
                  <span class="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">{{ item.product?.category?.name || '-' }}</span>
                  <span class="px-2 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-blue-500 uppercase">{{ item.product?.brand?.name || '-' }}</span>
                </div>
              </td>
              <td class="px-6 py-5 text-center">
                <span class="text-lg font-black text-slate-700">{{ item.quantity }}</span>
              </td>
              <td class="px-8 py-5 text-right">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border',
                    getStockStatus(item.quantity) === 'Out'
                      ? 'bg-red-500 text-white border-red-600'
                      : getStockStatus(item.quantity) === 'Critical'
                      ? 'bg-orange-100 text-orange-600 border-orange-200'
                      : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                  ]"
                >
                  <span v-if="getStockStatus(item.quantity) === 'Out'" class="mr-1">⚠️</span>
                  {{ getStockStatus(item.quantity) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-8 py-6 bg-slate-50/50 border-t border-slate-100">
        <Pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @change="page => changePage(page, fetchLowStock)"
        />
      </div>
    </div>
  </div>
</template>


