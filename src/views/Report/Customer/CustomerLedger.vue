<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

/* UI Components */
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import ReportMenu from '@/components/inc/SubSidebar/ReportMenu.vue'
import TableSkeleton from '@/components/Skeleton/Table.vue'
import Pagination from '@/components/Pagination.vue'

/* Stores / Composables */
import { useMessageStore } from '@/stores/useMessageStore'
import { usePagination } from '@/composables/usePagination'

const messageStore = useMessageStore()

/* ===============================
BREADCRUMB
=============================== */
const $breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Customer Ledger' }
]

/* ===============================
PAGINATION
=============================== */
const { currentPage, perPage, lastPage, setMeta, changePage } = usePagination(20)

/* ===============================
FILTERS
=============================== */
const fromDate = ref('')
const toDate = ref('')
const customerId = ref('')
const chequeNumber = ref('')

/* ===============================
DATA
=============================== */
const loading = ref(false)
const rows = ref<any[]>([])
const openingBalance = ref(0)
const closingBalance = ref(0)
const totals = ref({
  total_debit: 0,
  total_credit: 0
})

/* ===============================
CUSTOMERS LIST (optional)
=============================== */
const customers = ref([])
const loadCustomers = async () => {
  try {
    const res = await axiosInstance.get('/customers/option/list')
    customers.value = res.data.data
  } catch {
    messageStore.showError('Customers load failed')
  }
}

/* ===============================
FETCH REPORT
=============================== */
const fetchReport = async () => {
  loading.value = true
  try {
    const res = await axiosInstance.get('/report/customer-ledger/get', {
      params: {
        from_date: fromDate.value || undefined,
        to_date: toDate.value || undefined,
        customer_id: customerId.value || undefined,
        cheque_number: chequeNumber.value || undefined,
        page: currentPage.value,
        per_page: perPage.value
      }
    })

    rows.value = res.data.data
    openingBalance.value = res.data.opening_balance
    closingBalance.value = res.data.closing_balance
    totals.value = res.data.totals
    setMeta(res.data.pagination)
  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Ledger fetch failed')
    }
  } finally {
    loading.value = false
  }
}

/* ===============================
FILTER ACTIONS
=============================== */
const handleSearch = () => {
  currentPage.value = 1
  fetchReport()
}

const resetFilters = () => {
  fromDate.value = ''
  toDate.value = ''
  customerId.value = ''
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
FORMAT NUMBER
=============================== */
const formatNumber = (num: number) => {
  return Number(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/* ===============================
INIT
=============================== */
onMounted(() => {
  loadCustomers()
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
      <h2 class="text-2xl font-semibold">Customer Ledger</h2>
      <button @click="printReport" class="print:hidden bg-blue-600 text-white px-4 py-2 rounded">Print</button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 print:hidden">
      <input type="date" v-model="fromDate" class="border p-2">
      <input type="date" v-model="toDate" class="border p-2">

      <!-- Optional Customer Select -->
      <select v-model="customerId" class="border p-2">
        <option value="">All Customers</option>
        <option v-for="c in customers" :key="c.id" :value="c.id">
            {{ c.name }}
            <template v-if="c.phone"> - {{ c.phone }}</template>
        </option>
      </select>

      <input type="text" v-model="chequeNumber" placeholder="Cheque No" class="border p-2">
    </div>

    <!-- Filter buttons -->
    <div class="flex gap-2 mb-4 print:hidden">
      <button @click="handleSearch" class="bg-gray-700 text-white px-4 py-2 rounded">Search</button>
      <button @click="resetFilters" class="bg-gray-300 px-4 py-2 rounded">Reset</button>
    </div>

    <!-- Totals -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow">
        <p class="text-gray-500 text-sm">Opening Balance</p>
        <p class="text-xl font-bold">{{ formatNumber(openingBalance) }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow">
        <p class="text-gray-500 text-sm">Closing Balance</p>
        <p class="text-xl font-bold">{{ formatNumber(closingBalance) }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow">
        <p class="text-gray-500 text-sm">Total Debit / Credit</p>
        <p class="text-xl font-bold text-green-600">{{ formatNumber(totals.total_debit) }} / {{ formatNumber(totals.total_credit) }}</p>
      </div>
    </div>

    <!-- Ledger Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 text-left">#</th>
            <th class="p-2 text-left">Date</th>
            <th class="p-2 text-left">Type</th>
            <th class="p-2 text-left">Cheque</th>
            <th class="p-2 text-right">Debit</th>
            <th class="p-2 text-right">Credit</th>
            <th class="p-2 text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          <TableSkeleton v-if="loading" :colspan="8" />

          <tr v-for="(row,index) in rows" :key="row.id">
            <td class="p-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="p-2">{{ row.transaction_date }}</td>
            <td class="p-2">{{ row.transaction_type }}</td>
            <td class="p-2">{{ row.cheque_number }}</td>
            <td class="p-2 text-right text-green-600">{{ formatNumber(row.debit) }}</td>
            <td class="p-2 text-right text-red-600">{{ formatNumber(row.credit) }}</td>
            <td class="p-2 text-right font-semibold">{{ formatNumber(row.running_balance) }}</td>
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
  body { background: white; }
}
</style>