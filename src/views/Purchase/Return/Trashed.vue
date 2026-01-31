<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'
import { $routes, $labels } from '@/constants/purchaseReturn'

/* ===============================
  GLOBAL / SHARED
================================ */
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import PurchaseMenu from '@/components/inc/SubSidebar/PurchaseMenu.vue'
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
const supplierId = ref('')
const invoiceNo = ref('')
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
  if (status === 'pending') return 'bg-yellow-500'
  if (status === 'approved') return 'bg-green-500'
  return 'bg-red-500'
}

/* ===============================
  FETCH DATA
================================ */
const fetchRows = async () => {
  loading.value = true

  try {
    const res = await axiosInstance.get('/purchase-returns', {
      params: {
        return_invoice_no: invoiceNo.value || undefined,
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
  supplierId.value = ''
  invoiceNo.value = ''
  statusValue.value = ''
  currentPage.value = 1
  fetchRows()
}


//load suppliers
const suppliers = ref([])
const supplierLoading = ref<boolean>(false);
const loadSuppliers = async () => {
  loading.value = true
  supplierLoading.value = true
  try {
    const res = await axiosInstance.get('/suppliers/option/list')
    suppliers.value = res.data.data
  } catch (err) {
    messageStore.showError('Supplier load failed. Please check permission.')
  } finally {
    supplierLoading.value = false
    loading.value = false
  }
}

/* ===============================
  INIT
================================ */
onMounted(() => {
  //loadSuppliers()
  fetchRows()
})

</script>

<template>

<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <PurchaseMenu />
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
        <input type="text"
          v-model="invoiceNo"
          class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none" />
      </div>
      <!-- <div class="w-full md:w-1/3">
        <select
          v-model="supplierId"
          class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none">
          <option value="">All Suppliers</option>
          <option
            v-for="supplier in suppliers"
            :key="supplier.id"
            :value="supplier.id"
          >
            {{ supplier.name }}
            <template v-if="supplier.phone"> - {{ supplier.phone }}</template>
          </option>
        </select>
      </div> -->
      <div class="w-full md:w-1/5">
        <select v-model="statusValue" class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="cancelled">Cancelled</option>
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
            <th class="px-4 py-2 text-left">INV. No</th>
            <th class="px-4 py-2 text-left">Supplier</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-right">Net Total</th>
            <th class="px-4 py-2 text-right">Refund</th>
            <th class="px-4 py-2 text-right">Remaining</th>
            <th class="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">

          <TableSkeleton v-if="loading" :colspan="100" />
          
          <tr v-if="loading == false" v-for="(row, index) in rows" :key="row.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="px-4 py-2">{{ row.date }}</td>
            <td class="px-4 py-2">{{ row.invoice_no }}</td>
            <td class="px-4 py-2">
              {{ row.purchase.supplier.name }} - {{ row.purchase?.supplier?.phone  }}
            </td>
            <td class="px-4 py-2">
              <span class="px-3 py-1 rounded-full text-white text-sm" :class="statusClass(row.status)">
                {{ row.status }}
              </span>
            </td>
            <td class="px-4 py-2 text-right">{{ row.grand_total }}</td>
            <td class="px-4 py-2 text-right">{{ row.refund_amount }}</td>
            <td class="px-4 py-2 text-right">{{ row.due_amount }}</td>
            <td class="px-4 py-2">
              <RowActions
                :row="row"
                routeBase="purchase-returns"
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
