<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'
import { $routes, $labels } from '@/constants/accountIncomeExpense'

/* ===============================
  GLOBAL / SHARED
================================ */
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import AccountMenu from '@/components/inc/SubSidebar/AccountMenu.vue'
import TableSkeleton from '@/components/Skeleton/Table.vue'
import Pagination from '@/components/Pagination.vue'
import RowActions from '@/components/Table/RowActions.vue'

import { useMessageStore } from '@/stores/useMessageStore'
import { usePagination } from '@/composables/usePagination'

const messageStore = useMessageStore()
const router = useRouter()

/* ===============================
  PAGINATION (GLOBAL)
================================ */
const {
  currentPage,
  perPage,
  lastPage,
  setMeta,
  changePage,
} = usePagination(10)

/* =====================================================
   BREADCRUMB
===================================================== */
const $breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: $labels.singular_name + ' Lists', to: $routes.index },
  { label: $labels.singular_name + ' Lists' }
]

/* ===============================
  FILTERS
================================ */
const modeValue = ref('')
const typeValue = ref('')
const accountValue = ref('')

/* ===============================
  TABLE DATA
================================ */
const rows = ref<any[]>([])
const totalRows = ref(0)
const loading = ref(false)

/* ===============================
  FETCH DATA
================================ */
const fetchRows = async () => {
  loading.value = true

  try {
    const res = await axiosInstance.get('/other-income-expenses', {
      params: {
        mode: modeValue.value || undefined,
        type_id: typeValue.value || undefined,
        account_id: accountValue.value || undefined,
        page: currentPage.value,
        per_page: perPage.value,
        trashed: 'only',
      }
    })

    rows.value = res.data.data
    totalRows.value = res.data.meta.total
    setMeta(res.data.meta)

  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Fetch failed')
    }
  } finally {
    loading.value = false
  }
}

/* ===============================
  ACTIONS
================================ */
const handleSearch = () => {
  currentPage.value = 1
  fetchRows()
}

const resetFilters = () => {
  modeValue.value = ''
  typeValue.value = ''
  accountValue.value = ''
  currentPage.value = 1
  fetchRows()
}


//load accounts
const accounts = ref([])
const accountLoading = ref<boolean>(false);
const loadAccounts = async () => {
  loading.value = true
  accountLoading.value = true
  try {
    const res = await axiosInstance.get('/accounts/option/list')
    accounts.value = res.data.data
  } catch (err) {
    messageStore.showError('Account load failed. Please check permission.')
  } finally {
    accountLoading.value = false
    loading.value = false
  }
}

//load types
const types = ref([])
const typeLoading = ref<boolean>(false);
const loadTypes = async () => {
  typeLoading.value = true
  try {
    const res = await axiosInstance.get('/other-income-expense-types/option/list')
    types.value = res.data.data
  } catch (err) {
    messageStore.showError('Type load failed. Please check permission.')
  } finally {
    typeLoading.value = false
  }
}

//load taxes
const taxes = ref([])
const taxLoading = ref<boolean>(false);
const loadTaxes = async () => {
  taxLoading.value = true
  try {
    const res = await axiosInstance.get('/taxes/option/list')
    taxes.value = res.data.data
  } catch (err) {
    messageStore.showError('Tax load failed. Please check permission.')
  } finally {
    taxLoading.value = false
  }
}

/* ===============================
  INIT
================================ */
onMounted(() => {
  fetchRows();
  loadAccounts()
  loadTypes()
  loadTaxes()
});

</script>

<template>

<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <AccountMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4">

    <!-- Breadcrumb -->
    <Breadcrumb :items="$breadcrumbs" />

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <!-- Title + Total -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">{{ $labels.singular_name }} Trash Lists</h2>
        <span class="text-gray-600 font-medium">Totats: {{ totalRows }}</span>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 flex-wrap">
    
        <router-link :to="$routes.index" class="flex items-center gap-2 px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg"
               class="w-4 h-4"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15 19l-7-7 7-7" />
          </svg>
          Back to All
        </router-link>
        
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-4 items-end">

      <div class="w-full md:w-1/3">
        <select v-model="modeValue" class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none">
          <option value="">All Modes</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div class="w-full md:w-1/3">
        <select
            v-model="typeValue"
            class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none"
            :disabled="typeLoading || !types.length"
          >
            <option value="">All Types</option>
            <option v-for="type in types" :key="type.id" :value="type.id">
              {{ type.type_name }}
            </option>
          </select>
      </div>
      
      <div class="w-full md:w-1/3">
        <select
          v-model="accountValue"
          class="w-full border p-3"
          :disabled="accountLoading || !accounts.length"
        >
          <option value="">All Accounts</option>
          <option v-for="account in accounts" :key="account.id" :value="account.id">
            {{ account.account_name }} <template v-if="account.account_number"> - {{ account.account_number }}</template>
          </option>
        </select>
      </div>

      <div class="flex gap-2 w-full md:w-auto">
        <button @click="handleSearch" class="flex items-center gap-2 px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-800 transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/>
          </svg>
          Search
        </button>
        <button class="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
                @click="resetFilters">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Cancel
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">#</th>
            <th class="px-4 py-2 text-left">Date</th>
            <th class="px-4 py-2 text-left">Mode</th>
            <th class="px-4 py-2 text-left">Type</th>
            <th class="px-4 py-2 text-left">Account</th>
            <th class="px-4 py-2 text-left">Amount</th>
            <th class="px-4 py-2 text-left">Tax Rate(%)</th>
            <th class="px-4 py-2 text-left">Tax Amount</th>
            <th class="px-4 py-2 text-left">Total</th>
            <th class="px-4 py-2 text-left">Note</th>
            <th class="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">

          <TableSkeleton v-if="loading" :colspan="100" />
          
          <tr v-if="loading == false" v-for="(row, index) in rows" :key="row.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="px-4 py-2">{{ row.date }}</td>
            <td class="px-4 py-2">{{ row.mode }}</td>
            <td class="px-4 py-2">{{ row.type.type_name }}</td>
            <td class="px-4 py-2">{{ row.account.account_name }}</td>
            <td class="px-4 py-2">{{ row.amount }}</td>
            <td class="px-4 py-2">{{ row.tax_rate }}</td>
            <td class="px-4 py-2">{{ row.tax_amount }}</td>
            <td class="px-4 py-2">{{ row.total }}</td>
            <td class="px-4 py-2">{{ row.description }}</td>
            <td class="px-4 py-2 flex gap-2 items-center">
              <RowActions
                :row="row"
                routeBase="other-income-expenses"
                :onDeleted="() => {
                  rows = rows.filter(r => r.uuid !== row.uuid)
                  totalRows--
                }"
              />
            </td>
          </tr>
          <tr v-if="rows.length === 0 && loading == false">
            <td colspan="100" class="text-center">No record found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <Pagination
      :current-page="currentPage"
      :last-page="lastPage"
      @change="page => changePage(page, fetchRows)"
    />


  </div>

</div>
</template>
