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
  { label: 'Cash/Bank Report' }
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
const accountId = ref('')
const chequeNumber = ref('')

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
ACCOUNTS
=============================== */

const accounts = ref([])

const loadAccounts = async () => {
  try {
    const res = await axiosInstance.get('/accounts/option/list')
    accounts.value = res.data.data
  }
  catch {
    messageStore.showError('Account load failed')
  }
}

/* ===============================
FETCH REPORT
=============================== */

const fetchReport = async () => {

  loading.value = true

  try {

    const res = await axiosInstance.get('/report/account-report/get', {

      params: {

        from_date: fromDate.value || undefined,
        to_date: toDate.value || undefined,
        account_id: accountId.value || undefined,
        cheque_number: chequeNumber.value || undefined,

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
  accountId.value = ''
  chequeNumber.value = ''

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

  loadAccounts()

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
        Cash/Bank Report
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

      <input type="date" v-model="fromDate" class="border p-2">

      <input type="date" v-model="toDate" class="border p-2">

      <select v-model="accountId" class="border p-2">

        <option value="">All Accounts</option>

        <option
          v-for="account in accounts"
          :key="account.id"
          :value="account.id"
        >
          {{ account.account_name }} - {{ account.account_number }}
        </option>

      </select>

      <input
        type="text"
        placeholder="Cheque number"
        v-model="chequeNumber"
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

    <!-- Summary -->
    <div class="grid grid-cols-12 gap-6 mb-10">

      <div class="col-span-12 lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-purple-500 opacity-10 rounded-full"></div>
        
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">Closing Balance</p>
              <h2 class="text-4xl font-black text-white tracking-tight">{{ formatNumber(totals.closing_balance) }}</h2>
            </div>
            <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <svg class="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>

          <div class="mt-8 flex gap-4">
            <div class="flex-1 bg-white/5 rounded-2xl p-3 border border-white/10">
              <p class="text-gray-400 text-[10px] uppercase font-bold mb-1">Status</p>
              <p class="text-blue-400 font-bold text-lg">Active Ledger</p>
            </div>
            <div class="flex-1 bg-white/5 rounded-2xl p-3 border border-white/10">
              <p class="text-gray-400 text-[10px] uppercase font-bold mb-1">Currency</p>
              <p class="text-white font-bold text-lg">BDT</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div class="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all duration-300">
          <div class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
            <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <p class="text-sm font-medium text-gray-500">Opening Balance</p>
          <p class="text-xl font-bold text-gray-800 mt-1">{{ formatNumber(openingBalance) }}</p>
        </div>

        <div class="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-green-200 transition-all duration-300">
          <div class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-green-50 transition-colors">
            <svg class="w-5 h-5 text-gray-400 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <p class="text-sm font-medium text-gray-500">Total Debit</p>
          <p class="text-xl font-bold text-green-600 mt-1">+ {{ formatNumber(totals.total_debit) }}</p>
        </div>

        <div class="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-red-200 transition-all duration-300">
          <div class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-red-50 transition-colors">
            <svg class="w-5 h-5 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path>
            </svg>
          </div>
          <p class="text-sm font-medium text-gray-500">Total Credit</p>
          <p class="text-xl font-bold text-red-600 mt-1">- {{ formatNumber(totals.total_credit) }}</p>
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

            <th class="p-2 text-left">Cheque</th>

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
              {{ row.cheque_number }}
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