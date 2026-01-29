<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'
import { $routes, $labels } from '@/constants/purchase'

/* ===============================
  GLOBAL / SHARED
================================ */
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import TableSkeleton from '@/components/Skeleton/Table.vue'
import Pagination from '@/components/Pagination.vue'

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
  { label: $labels.singular_name + ' Lists' }
]

/* ===============================
  FILTERS
================================ */
const nameValue = ref('')
const phoneValue = ref('')
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
    const res = await axiosInstance.get('/suppliers/option/list', {
      params: {
        name: nameValue.value || undefined,
        phone: phoneValue.value || undefined,
        page: currentPage.value,
        per_page: perPage.value,
        status: 'active',
        sort_by: 'name',
        sort_dir: 'asc',
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
  nameValue.value = ''
  phoneValue.value = ''
  statusValue.value = ''
  currentPage.value = 1
  fetchRows()
}

const getSupplier = (supplier) => {
  router.push(`/purchase/create/${supplier.uuid}`)
}


// instant parents create
import SupplierCreateForm from '@/components/modals/Supplier/SupplierCreateForm.vue'
const showSupplierModal = ref(false)
const onSupplierSaved = async () => {
  showSupplierModal.value = false
  await fetchRows() // dropdown refresh
}

/* ===============================
  INIT
================================ */
onMounted(fetchRows)

</script>


<template>
  <div class="w-4xl m-auto p-4">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

  <!-- modals -->
    <!-- supplier modal -->
    <div v-if="showSupplierModal"
       class="fixed inset-0 bg-black/50 flex items-center justify-center z-100">

      <div class="bg-white w-full max-w-xl rounded-xl p-6">

        <h3 class="text-lg font-semibold mb-4">Add New Supplier</h3>

        <SupplierCreateForm
          @saved="onSupplierSaved"
          @cancel="showSupplierModal = false"
        />

      </div>
    </div>

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <!-- Title + Total -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">Supplier Lists</h2>
        <span class="text-gray-600 font-medium">Total Suppliers: {{ totalSuppliers }}</span>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 flex-wrap">

        <router-link to="/purchase" class="flex items-center gap-2 px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1" ry="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1" ry="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1" ry="1"/>
        </svg>
          Back to All
        </router-link>

        <button type="button" @click="showSupplierModal = true" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create
        </button>

      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-4 items-end">
      <div class="w-full md:w-1/3">
        <input v-model="nameValue" type="text" placeholder="Name..."
               class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none" />
      </div>
      <div class="w-full md:w-1/3">
        <input v-model="phoneValue" type="text" placeholder="Phone..."
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
              <th class="px-4 py-2 text-left">Name</th>
              <th class="px-4 py-2 text-left">Phone</th>
              <th class="px-4 py-2 text-left">Address</th>
            <th class="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">

          <TableSkeleton v-if="loading" :colspan="100" />
          
          <tr v-if="loading == false" v-for="(row, index) in rows" :key="row.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="px-4 py-2">{{ row.name }}</td>
            <td class="px-4 py-2">{{ row.phone }}</td>
            <td class="px-4 py-2">{{ row.address }}</td>
            <td class="px-4 py-2">
              <div class="flex justify-center gap-2">
                <button @click="getSupplier(row)" class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                      title="Go">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19 8l4 4m0 0l-4 4m4-4H12" />
                </svg>
              </button>
              </div>
            </td>
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
</template>
