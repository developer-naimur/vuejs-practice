<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

/* ===============================
  GLOBAL / SHARED
================================ */
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import SettingsMenu from '@/components/inc/SubSidebar/SettingsMenu.vue'
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

/* ===============================
  PAGE META
================================ */
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Adjustment Head Lists', to: '/setting/adjustment-head' },
  { label: 'Adjustment Head Trash Lists' }
]

/* ===============================
  FILTERS
================================ */
const searchValue = ref('')
const statusValue = ref('')

/* ===============================
  TABLE DATA
================================ */
const rows = ref<any[]>([])
const totalRows = ref(0)
const loading = ref(false)

/* ===============================
  STATUS BADGE
================================ */
const statusClass = (status: string) => {
  if (status === 'active') return 'bg-green-500'
  if (status === 'inactive') return 'bg-yellow-500'
  return 'bg-red-500'
}

/* ===============================
  FETCH DATA
================================ */
const fetchRows = async () => {
  loading.value = true

  try {
    const res = await axiosInstance.get('/adjustment-heads', {
      params: {
        name: searchValue.value || undefined,
        status: statusValue.value || undefined,
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
  searchValue.value = ''
  statusValue.value = ''
  currentPage.value = 1
  fetchRows()
}

/* ===============================
  INIT
================================ */
onMounted(fetchRows)
</script>

<template>

<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <SettingsMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <!-- Title + Total -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">Adjustment Head Trash Lists</h2>
        <span class="text-gray-600 font-medium">Totals: {{ totalRows }}</span>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 flex-wrap">

        <router-link to="/setting/adjustment-head" class="flex items-center gap-2 px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition">
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
        <input v-model="searchValue" type="text" placeholder="Search..."
               class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none" />
      </div>
      <div class="w-full md:w-1/5">
        <select v-model="statusValue" class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none">
          <option value="">Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
            <th class="px-4 py-2 text-left">Name</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">

          <TableSkeleton v-if="loading" :colspan="100" />
          
          <tr v-if="loading == false" v-for="(row, index) in rows" :key="row.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="px-4 py-2">{{ row.head_name }}</td>
            <td class="px-4 py-2">
              <span class="px-3 py-1 rounded-full text-white text-sm" :class="statusClass(row.status)">
                {{ row.status }}
              </span>
            </td>
            <td class="px-4 py-2 flex gap-2 items-center">
              <RowActions
                :row="row"
                routeBase="adjustment-heads"
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
