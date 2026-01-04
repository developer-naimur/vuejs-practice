<script setup>
import { ref, computed } from 'vue'
import TableSkeleton from '@/components/Skeleton/Table.vue'
import { useRouter } from 'vue-router'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

const router = useRouter()
// ------------------------
// Breadcrumb
// ------------------------
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Create New Sale' }
]

// ------------------------
// customers Data
// ------------------------
const customers = ref([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alex Brown' },
  { id: 4, name: 'Mary Jane' },
  { id: 5, name: 'Peter Parker' }
])

const trashCustomers = ref([]) // soft deleted customers

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

// Filtered & Paginated customers
const filteredCustomers = computed(() => {
  return customers.value
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesStatus = statusFilter.value ? customer.status === statusFilter.value : true
      return matchesSearch && matchesStatus
    })
    .slice((currentPage.value - 1) * perPage.value, currentPage.value * perPage.value)
})

const totalCustomers = computed(() => customers.value.length)
const totalPages = computed(() => Math.ceil(filteredCustomers.value.length / perPage.value))

// ------------------------
// Filters
// ------------------------
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}


const getCustomer = (customer) => {
  router.push(`/sale/retail-sale/create/${customer.id}`)
}
</script>

<template>
  <div class="w-4xl m-auto p-4">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <!-- Title + Total -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">Get Customer from Lists</h2>
        <span class="text-gray-600 font-medium">Total Customers: {{ totalCustomers }}</span>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 flex-wrap">

        <router-link to="/sale/retail-sale" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
		        <rect x="3" y="3" width="7" height="7" rx="1" ry="1"/>
		        <rect x="14" y="3" width="7" height="7" rx="1" ry="1"/>
		        <rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>
		        <rect x="14" y="14" width="7" height="7" rx="1" ry="1"/>
		    </svg>
          Back to All
        </router-link>

      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-4 items-end">
      <div class="w-full md:w-1/3">
        <input v-model="searchQuery" type="text" placeholder="Search..."
               class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none" />
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
            <th class="px-4 py-2 text-left">Name</th>
            <th class="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">

          <TableSkeleton :colspan="100" />
          
          <tr v-for="(customer, index) in filteredCustomers" :key="customer.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="px-4 py-2">{{ customer.name }}</td>
            <td class="px-4 py-2">
              <div class="flex justify-center gap-2">
                <button @click="getCustomer(customer)" class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
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
    <div class="flex justify-between items-center mt-4">
      <div>
        Showing <span class="font-semibold">{{ (currentPage-1)*perPage + 1 }}</span> to
        <span class="font-semibold">{{ Math.min(currentPage*perPage, filteredCustomers.length) }}</span> of
        <span class="font-semibold">{{ totalCustomers }}</span> entries
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="currentPage = Math.max(currentPage-1,1)">&laquo;</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100" v-for="n in Math.ceil(totalCustomers/perPage)" :key="n" @click="currentPage=n">{{ n }}</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="currentPage = Math.min(currentPage+1, Math.ceil(totalCustomers/perPage))">&raquo;</button>
      </div>
    </div>

  </div>
</template>
