<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'
import { $routes, $labels } from '@/constants/accountFundTransfer'

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
  { label: $labels.singular_name + ' Trash Lists' }
]

/* ===============================
  FILTERS
================================ */
const dateValue = ref('')
const fromAccountValue = ref('')
const toAccountValue = ref('')

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
    const res = await axiosInstance.get('/account-fund-transfers', {
      params: {
        transfer_date: dateValue.value || undefined,
        from_account_id: fromAccountValue.value || undefined,
        to_account_id: toAccountValue.value || undefined,
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
  dateValue.value = ''
  fromAccountValue.value = ''
  toAccountValue.value = ''
  currentPage.value = 1
  fetchRows()
}


//load accounts
const accounts = ref([])
const accountLoading = ref<boolean>(false);
const loadAccounts = async () => {
  accountLoading.value = true
  try {
    const res = await axiosInstance.get('/accounts/option/list')
    accounts.value = res.data.data
  } catch (err) {
    messageStore.showError('Account load failed. Please check permission.')
  } finally {
    accountLoading.value = false
  }
}

/* ===============================
  INIT
================================ */
onMounted(() => {
  fetchRows()
  loadAccounts()
})

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
    
        <router-link :to="$routes.create" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create
        </router-link>

        <router-link :to="$routes.trash" class="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
                     01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0
                     011-1h4a1 1 0 011 1v2" />
          </svg>
          Trash
        </router-link>
        
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-4 items-end">

      <div class="w-full md:w-1/3">
        <select
              v-model="fromAccountValue"
              class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none"
              :disabled="accountLoading || !accounts.length"
            >
              <option value="">Transfer From Account</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.account_name }} <template v-if="account.account_number"> - {{ account.account_number }}</template>
              </option>
            </select>
      </div>
      <div class="w-full md:w-1/3">
        <select
              v-model="toAccountValue"
              class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none"
              :disabled="accountLoading || !accounts.length"
            >
              <option value="">Transfer To Account</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.account_name }} <template v-if="account.account_number"> - {{ account.account_number }}</template>
              </option>
            </select>
      </div>
      <div class="w-full md:w-1/3">
        <input v-model="dateValue" type="date" placeholder="Search..."
               class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none" />
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
            <th class="px-4 py-2 text-left">Transfer From</th>
            <th class="px-4 py-2 text-left">Transfer To</th>
            <th class="px-4 py-2 text-left">Amount</th>
            <th class="px-4 py-2 text-left">Note</th>
            <th class="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">

          <TableSkeleton v-if="loading" :colspan="100" />
          
          <tr v-if="loading == false" v-for="(row, index) in rows" :key="row.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="px-4 py-2">{{ row.transfer_date }}</td>
            <td class="px-4 py-2">
              {{ row.from_account.account_name }} <template v-if="row.from_account.account_number">- {{ row.from_account.account_number }}</template>
            </td>
            <td class="px-4 py-2">
              {{ row.to_account.account_name }} <template v-if="row.to_account.account_number">- {{ row.to_account.account_number }}</template>
            </td>
            <td class="px-4 py-2">{{ row.amount }}</td>
            <td class="px-4 py-2">{{ row.note }}</td>
            <td class="px-4 py-2 flex gap-2 items-center">
              <RowActions
                :row="row"
                routeBase="account-fund-transfers"
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
