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


/* ================= LOW STOCK DATA ================= */
const lowStock = [
  { name: 'Rice 25kg', qty: 3, min: 5, status: 'Low' },
  { name: 'Oil 5L', qty: 0, min: 5, status: 'Out' }
]



onMounted(() => {
  fetchDashboard()
  fetchStockSummary()
  fetchSalesReturn()
  fetchProfitLoss()
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
  <div class="p-6 space-y-6 min-h-screen">

    <!-- ================= FILTER BAR ================= -->
    <div class="flex flex-wrap gap-3 justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p class="text-sm text-gray-500">Business overview</p>
      </div>

      <div class="flex items-center gap-2">
        <select
          v-model="dateFilter"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="custom">Custom</option>
        </select>

        <div v-if="dateFilter === 'custom'" class="flex items-center gap-2">
          <input
            type="date"
            v-model="fromDate"
            class="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <span class="text-gray-500">to</span>
          <input
            type="date"
            v-model="toDate"
            class="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- ================= KPI CARDS (TOP) ================= -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      <DashboardCardSkeleton v-if="loading" :cardNumber="10" />

      <div v-else
           v-for="(card, index) in kpiCards"
           :key="index"
           :class="['relative p-5 rounded-lg shadow hover:shadow-lg transition cursor-pointer', card.bg, card.border]">
        <p class="text-sm text-gray-500">{{ card.title }}</p>
        <h2 :class="['text-2xl font-bold mt-1', card.text]">{{ card.value }}</h2>
      </div>

    </div>

    <!-- ================= CHARTS ================= -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div class="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">

        <div class="flex items-center gap-2 mb-4">
          <button 
            @click="prevWeek" 
            :disabled="salesReturnloading" 
            class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev Week
            <span v-if="salesReturnloading && salesReturnActiveBtn === 'prev'" class="ml-2 animate-spin">⏳</span>
          </button>

          <button 
            @click="resetCurrentWeek" 
            :disabled="salesReturnloading" 
            class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Current Week
            <span v-if="salesReturnloading && salesReturnActiveBtn === 'current'" class="ml-2 animate-spin">⏳</span>
          </button>

          <button 
            @click="nextWeek" 
            :disabled="salesReturnloading" 
            class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Week
            <span v-if="salesReturnloading && salesReturnActiveBtn === 'next'" class="ml-2 animate-spin">⏳</span>
          </button>
        </div>

        <h3 class="font-semibold mb-4 text-gray-700">Sales vs Return</h3>
        <apexchart
          type="bar"
          height="300"
          :options="salesReturnOptions"
          :series="salesReturnSeries"
        />
      </div>

      <div class="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
        <h3 class="font-semibold mb-4 text-gray-700">Profit vs Loss</h3>

        <div class="flex items-center gap-2 mb-4">
            <button 
              @click="prevProfitWeek" 
              :disabled="profitLossLoading" 
              class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev Week
              <span v-if="profitLossLoading && profitLossActiveBtn === 'prev'" class="ml-2 animate-spin">⏳</span>
            </button>

            <button 
              @click="resetProfitCurrentWeek" 
              :disabled="profitLossLoading" 
              class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Current Week
              <span v-if="profitLossLoading && profitLossActiveBtn === 'current'" class="ml-2 animate-spin">⏳</span>
            </button>

            <button 
              @click="nextProfitWeek" 
              :disabled="profitLossLoading" 
              class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Week
              <span v-if="profitLossLoading && profitLossActiveBtn === 'next'" class="ml-2 animate-spin">⏳</span>
            </button>
          </div>

          <apexchart
            type="line"
            height="300"
            :options="profitLossOptions"
            :series="profitLossSeries"
          />
      </div>
    </div>

    <!-- ================= LOW STOCK TABLE ================= -->
    <div class="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
      <h3 class="font-semibold mb-4 text-gray-700">Low Stock Alert</h3>
      <table class="w-full text-sm border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left">Product</th>
            <th class="p-3 text-center">Stock Qty</th>
            <th class="p-3 text-center">Min Qty</th>
            <th class="p-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody>

          <TableSkeleton :colspan="100" />

          <tr class="border-b hover:bg-gray-50 transition" v-for="(item, i) in lowStock" :key="i">
            <td class="p-3">{{ item.name }}</td>
            <td class="p-3 text-center">{{ item.qty }}</td>
            <td class="p-3 text-center">{{ item.min }}</td>
            <td :class="['p-3 text-center font-semibold', item.status === 'Low' ? 'text-yellow-600' : 'text-red-600']">{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

