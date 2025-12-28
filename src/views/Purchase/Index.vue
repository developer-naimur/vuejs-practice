<script setup>
import { ref, computed } from 'vue'
import PurchaseMenu from '@/components/inc/SubSidebar/PurchaseMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

import { useRouter } from 'vue-router'
const router = useRouter()

// ------------------------
// Breadcrumb
// ------------------------
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Purchase Lists' }
]

// ------------------------
// purchases Data
// ------------------------
const purchases = ref([
  { id: 1, reference: 'S-1001', customer: 'John Doe', total: 250, date: '2025-12-20', status: 'Completed' },
  { id: 2, reference: 'S-1002', customer: 'Jane Smith', total: 150, date: '2025-12-21', status: 'Pending' },
  { id: 3, reference: 'S-1003', customer: 'Alex Brown', total: 300, date: '2025-12-21', status: 'Cancelled' },
  { id: 4, reference: 'S-1004', customer: 'Mary Jane', total: 400, date: '2025-12-22', status: 'Completed' },
  { id: 5, reference: 'S-1005', customer: 'Peter Parker', total: 500, date: '2025-12-22', status: 'Pending' }
])

// ------------------------
// Filters
// ------------------------
const searchQuery = ref('')
const statusFilter = ref('')

// ------------------------
// Pagination
// ------------------------
const currentPage = ref(1)
const perPage = ref(5)

const filteredPurchases = computed(() => {
  return purchases.value
    .filter(s => {
      const matchesSearch =
        s.reference.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        s.customer.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesStatus = statusFilter.value ? s.status === statusFilter.value : true
      return matchesSearch && matchesStatus
    })
    .slice((currentPage.value - 1) * perPage.value, currentPage.value * perPage.value)
})

const totalPurchases = computed(() => purchases.value.length)

// ------------------------
// Status Classes
// ------------------------
const statusClass = status => {
  if (status === 'Completed') return 'bg-green-500'
  if (status === 'Pending') return 'bg-yellow-500'
  return 'bg-red-500'
}

// ------------------------
// Actions
// ------------------------
const viewPurchase = (purchase) => {
  router.push(`/purchase/${purchase.id}`)
}
const editPurchase = purchase => alert(`Edit ${purchase.reference}`)
const trashPurchase = purchase => {
  if (confirm(`Move ${purchase.reference} to trash?`)) {
    purchases.value = purchases.value.filter(s => s.id !== purchase.id)
  }
}

// ------------------------
// Reset Filters
// ------------------------
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}
</script>

<template>
  <div class="flex gap-4">

  <div class="flex-none">
    <PurchaseMenu />
  </div>

  <div class="flex-1 ml-[320px] p-4">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">Purchases Lists</h2>
        <span class="text-gray-600 font-medium">Total Purchases: {{ totalPurchases }}</span>
      </div>

      <div class="flex gap-2 flex-wrap">
        <router-link to="/get-supplier" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Purchase
        </router-link>

        <router-link to="/purchase/trashed" class="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
                     01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0
                     011-1h4a1 1 0 011 1v2" />
          </svg>
          Trashed
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-4 items-end">
      <div class="w-full md:w-1/3">
        <input v-model="searchQuery" type="text" placeholder="Search by reference or customer..."
               class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none" />
      </div>
      <div class="w-full md:w-1/5">
        <select v-model="statusFilter" class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none">
          <option value="">Status</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>Cancelled</option>
        </select>
      </div>
      <div class="flex gap-2 w-full md:w-auto">
        <button class="flex items-center gap-2 px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/>
          </svg>
          Search
        </button>
        <button class="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
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
            <th class="px-4 py-2 text-left">Reference</th>
            <th class="px-4 py-2 text-left">Customer</th>
            <th class="px-4 py-2 text-left">Total</th>
            <th class="px-4 py-2 text-left">Date</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(purchase, index) in filteredPurchases" :key="purchase.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="px-4 py-2">{{ purchase.reference }}</td>
            <td class="px-4 py-2">{{ purchase.customer }}</td>
            <td class="px-4 py-2">{{ purchase.total }}</td>
            <td class="px-4 py-2">{{ purchase.date }}</td>
            <td class="px-4 py-2">
              <span class="px-3 py-1 rounded-full text-white text-sm" :class="statusClass(purchase.status)">
                {{ purchase.status }}
              </span>
            </td>
            <td class="px-4 py-2">
              <div class="flex justify-center gap-2">
                <!-- View -->
                <button @click="viewPurchase(purchase)" class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition" title="View">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </button>

                <!-- Edit -->
                <button @click="editPurchase(purchase)" class="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-600 hover:text-white transition" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M11 4h2m2.121 2.121a3 3 0 010 4.243L9 16l-4 1 1-4 6.121-6.121a3 3 0 014.243 0z"/>
                  </svg>
                </button>

                <!-- Trash -->
                <button @click="trashPurchase(purchase)" class="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition" title="Trash">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <div>
        Showing <span class="font-semibold">{{ (currentPage-1)*perPage + 1 }}</span> to
        <span class="font-semibold">{{ Math.min(currentPage*perPage, filteredPurchases.length) }}</span> of
        <span class="font-semibold">{{ totalPurchases }}</span> entries
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="currentPage = Math.max(currentPage-1,1)">&laquo;</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100" v-for="n in Math.ceil(totalPurchases/perPage)" :key="n" @click="currentPage=n">{{ n }}</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="currentPage = Math.min(currentPage+1, Math.ceil(totalPurchases/perPage))">&raquo;</button>
      </div>
    </div>

  </div>
  
</div>
</template>
