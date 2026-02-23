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
  { label: 'Current Stock Report' }
]

/* ===============================
PAGINATION
=============================== */
const { currentPage, perPage, lastPage, setMeta, changePage } = usePagination(20)

/* ===============================
FILTERS
=============================== */
const categoryId = ref('')
const brandId = ref('')
const name = ref('')
const sku = ref('')

/* ===============================
DATA
=============================== */
const loading = ref(false)
const rows = ref<any[]>([])
const totals = ref({ total_quantity: 0 })

/* ===============================
FETCH REPORT
=============================== */
const fetchReport = async () => {
  loading.value = true

  try {
    const res = await axiosInstance.get('/report/current-stock/get', {
      params: {
        category_id: categoryId.value || undefined,
        brand_id: brandId.value || undefined,
        name: name.value || undefined,
        sku: sku.value || undefined,
        page: currentPage.value,
        per_page: perPage.value
      }
    })

    rows.value = res.data.data
    totals.value = res.data.totals
    setMeta(res.data.pagination)
  }
  catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Report fetch failed')
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
  categoryId.value = ''
  brandId.value = ''
  name.value = ''
  sku.value = ''
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


/* ===============================
INIT
=============================== */
onMounted(() => {
  loadBrands()
  loadCategories()
  fetchReport()
})
</script>

<template>
<div class="flex gap-4 print:block">

  <!-- Sidebar -->
  <div class="hidden lg:block flex-none print:hidden">
    <ReportMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4">

    <!-- Breadcrumb -->
    <Breadcrumb :items="$breadcrumbs" />

    <!-- Header -->
    <div class="flex justify-between items-center mb-4 print:block">
      <h2 class="text-2xl font-semibold">Current Stock Report</h2>
      <button @click="printReport" class="print:hidden bg-blue-600 text-white px-4 py-2 rounded">
        Print
      </button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 print:hidden">
      <input type="text" v-model="name" placeholder="Product Name" class="border p-2">
      <input type="text" v-model="sku" placeholder="SKU" class="border p-2">

      <select v-model="brandId" class="border p-2">

        <option value="">All Brands</option>

        <option
          v-for="brand in brands"
          :key="brand.id"
          :value="brand.id"
        >
          {{ brand.brand_name }}

        </option>

      </select>

      <select v-model="categoryId" class="border p-2">

        <option value="">All Categories</option>

        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.category_name }}

        </option>

      </select>
    </div>

    <!-- Filter buttons -->
    <div class="flex gap-2 mb-4 print:hidden">
      <button @click="handleSearch" class="bg-gray-700 text-white px-4 py-2 rounded">Search</button>
      <button @click="resetFilters" class="bg-gray-300 px-4 py-2 rounded">Reset</button>
    </div>

    <!-- TOTAL SUMMARY -->
    <div class="grid grid-cols-12 gap-6 mb-10">
      <div class="col-span-12 lg:col-span-4 bg-gradient-to-br from-slate-900 to-indigo-900 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500 opacity-10 rounded-full"></div>
        
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">Total Stock Quantity</p>
              <h2 class="text-4xl font-black text-white tracking-tight">{{ formatNumber(totals.total_quantity) }}</h2>
            </div>
            
            <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <svg class="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 text-left">#</th>
            <th class="p-2 text-left">Product</th>
            <th class="p-2 text-left">SKU</th>
            <th class="p-2 text-right">Quantity</th>
            <th class="p-2 text-right">Cost Price</th>
          </tr>
        </thead>
        <tbody>
          <TableSkeleton v-if="loading" :colspan="7" />
          <tr v-for="(row,index) in rows" :key="row.id">
            <td class="p-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="p-2">{{ row.product.name }}</td>
            <td class="p-2">{{ row.product.sku }}</td>
            <td class="p-2 text-right font-semibold">{{ formatNumber(row.quantity) }}</td>
            <td class="p-2 text-right">{{ formatNumber(row.cost_price) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="print:hidden">
      <Pagination :current-page="currentPage" :last-page="lastPage" @change="page => changePage(page, fetchReport)" />
    </div>

  </div>
</div>
</template>

<style>
@media print {
  body {
    background: white;
  }
}
</style>