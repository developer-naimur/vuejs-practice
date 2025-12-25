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
      <div v-for="(card, index) in kpiCards" :key="index"
           :class="['relative p-5 rounded-lg shadow hover:shadow-lg transition cursor-pointer', card.bg, card.border]">
        <p class="text-sm text-gray-500">{{ card.title }}</p>
        <h2 :class="['text-2xl font-bold mt-1', card.text]">{{ card.value }}</h2>
      </div>
    </div>

    <!-- ================= CHARTS ================= -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div class="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
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

<script setup lang="ts">
import ApexChart from 'vue3-apexcharts'
import { ref } from 'vue'

/* ================= DATE FILTER ================= */
const dateFilter = ref<'today'|'week'|'month'|'year'|'custom'>('today')
const fromDate = ref<string|null>(null)
const toDate = ref<string|null>(null)

/* ================= KPI CARDS ================= */
const kpiCards = [
  { title: 'Total Sales', value: '৳ 0', bg: 'bg-white', border: 'border-l-4 border-blue-500', text: 'text-blue-600' },
  { title: 'Sales Return', value: '৳ 0', bg: 'bg-white', border: 'border-l-4 border-red-500', text: 'text-red-600' },
  { title: 'Total Purchase', value: '৳ 0', bg: 'bg-white', border: 'border-l-4 border-indigo-500', text: 'text-indigo-600' },
  { title: 'Total Stock Qty', value: '0', bg: 'bg-white', border: 'border-l-4 border-purple-500', text: 'text-purple-600' },
  { title: 'Total Stock Amount', value: '৳ 0', bg: 'bg-white', border: 'border-l-4 border-teal-500', text: 'text-teal-600' },
  { title: 'Cash Balance', value: '৳ 0', bg: 'bg-white', border: 'border-l-4 border-green-500', text: 'text-green-600' },
  { title: 'Bank Balance', value: '৳ 0', bg: 'bg-white', border: 'border-l-4 border-cyan-500', text: 'text-cyan-600' },
  { title: 'Profit & Loss', value: '৳ 0', bg: 'bg-white', border: 'border-l-4 border-emerald-500', text: 'text-emerald-600' }
]

/* ================= CHART DATA ================= */
const salesReturnSeries = [
  { name: 'Sales', data: [12000,15000,18000,16000,20000,22000,25000] },
  { name: 'Return', data: [2000,1500,1800,1200,1600,1700,1400] }
]
const salesReturnOptions = {
  chart: { toolbar: { show: false } },
  xaxis: { categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  colors: ['#2563eb','#dc2626'],
  legend: { position: 'top' }
}

const profitLossSeries = [
  { name: 'Profit', data: [5000,6200,7200,6800,8000,9000,10000] },
  { name: 'Loss', data: [1200,800,900,700,600,500,400] }
]
const profitLossOptions = {
  chart: { toolbar: { show: false } },
  stroke: { curve: 'smooth' },
  xaxis: { categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  colors: ['#16a34a','#dc2626'],
  legend: { position: 'top' }
}

/* ================= LOW STOCK DATA ================= */
const lowStock = [
  { name: 'Rice 25kg', qty: 3, min: 5, status: 'Low' },
  { name: 'Oil 5L', qty: 0, min: 5, status: 'Out' }
]
</script>

<script lang="ts">
export default {
  components: {
    apexchart: ApexChart
  }
}
</script>
