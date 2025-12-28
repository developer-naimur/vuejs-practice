<script setup>
import { ref, computed } from 'vue'
import StockMenu from '@/components/inc/SubSidebar/StockMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ------------------------
// Breadcrumb
// ------------------------
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Stock Operations' }
]

// ------------------------
// Stock Operations Data (Demo)
// ------------------------
const operations = ref([
  {
    id: 1,
    reference: 'OP-1001',
    operation_date: '2025-12-20',
    operation_type: 'damage',
    direction: 'out',
    party_type: 'system',
    party_name: 'System',
    reason: 'Broken items'
  },
  {
    id: 2,
    reference: 'OP-1002',
    operation_date: '2025-12-21',
    operation_type: 'free',
    direction: 'out',
    party_type: 'customer',
    party_name: 'Rahim',
    reason: 'Free offer'
  },
  {
    id: 3,
    reference: 'OP-1003',
    operation_date: '2025-12-21',
    operation_type: 'supplier_adjustment',
    direction: 'in',
    party_type: 'supplier',
    party_name: 'ABC Supplier',
    reason: 'Extra delivery'
  }
])

// ------------------------
// Filters
// ------------------------
const searchQuery = ref('')
const partyFilter = ref('')
const directionFilter = ref('')

// ------------------------
// Pagination
// ------------------------
const currentPage = ref(1)
const perPage = ref(5)

const filteredOperations = computed(() => {
  return operations.value
    .filter(op => {
      const matchesSearch =
        op.reference.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        op.reason.toLowerCase().includes(searchQuery.value.toLowerCase())

      const matchesParty = partyFilter.value
        ? op.party_type === partyFilter.value
        : true

      const matchesDirection = directionFilter.value
        ? op.direction === directionFilter.value
        : true

      return matchesSearch && matchesParty && matchesDirection
    })
    .slice(
      (currentPage.value - 1) * perPage.value,
      currentPage.value * perPage.value
    )
})

const totalOperations = computed(() => operations.value.length)

// ------------------------
// Badge Classes
// ------------------------
const directionClass = dir => {
  if (dir === 'in') return 'bg-green-500'
  return 'bg-red-500'
}

// ------------------------
// Actions
// ------------------------
const viewOperation = op => {
  router.push(`/stock/operation/${op.id}`)
}

const trashOperation = op => {
  if (confirm(`Move ${op.reference} to trash?`)) {
    operations.value = operations.value.filter(o => o.id !== op.id)
  }
}

// ------------------------
// Reset Filters
// ------------------------
const resetFilters = () => {
  searchQuery.value = ''
  partyFilter.value = ''
  directionFilter.value = ''
  currentPage.value = 1
}
</script>

<template>
  <div class="flex gap-4">

  <div class="flex-none">
    <StockMenu />
  </div>

  <div class="flex-1 ml-[320px] p-4">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">Stock Operations</h2>
        <span class="text-gray-600 font-medium">
          Total: {{ totalOperations }}
        </span>
      </div>

      <div class="flex gap-2 flex-wrap">
	      <div class="flex gap-2 flex-wrap">
	        <router-link to="/stock/operation/create" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
	          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
	               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
	            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
	          </svg>
	          Add Operation
	        </router-link>

	        <router-link to="/stock/operation/trashed" class="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer">
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
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-4 items-end">
      <div class="w-full md:w-1/3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by reference or reason..."
          class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div class="w-full md:w-1/5">
        <select v-model="partyFilter"
                class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500">
          <option value="">Party</option>
          <option value="system">System</option>
          <option value="customer">Customer</option>
          <option value="supplier">Supplier</option>
        </select>
      </div>

      <div class="w-full md:w-1/5">
        <select v-model="directionFilter"
                class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500">
          <option value="">Direction</option>
          <option value="in">In</option>
          <option value="out">Out</option>
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
            <th class="px-4 py-2 text-left">Date</th>
            <th class="px-4 py-2 text-left">Type</th>
            <th class="px-4 py-2 text-left">Party</th>
            <th class="px-4 py-2 text-center">Direction</th>
            <th class="px-4 py-2 text-left">Reason</th>
            <th class="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(op, index) in filteredOperations"
            :key="op.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2">
              {{ (currentPage - 1) * perPage + index + 1 }}
            </td>
            <td class="px-4 py-2">{{ op.reference }}</td>
            <td class="px-4 py-2">{{ op.operation_date }}</td>
            <td class="px-4 py-2 capitalize">
              {{ op.operation_type.replace('_', ' ') }}
            </td>
            <td class="px-4 py-2">
              {{ op.party_name }}
              <small class="text-gray-400">({{ op.party_type }})</small>
            </td>
            <td class="px-4 py-2 text-center">
              <span
                class="px-3 py-1 rounded-full text-white text-sm"
                :class="directionClass(op.direction)"
              >
                {{ op.direction.toUpperCase() }}
              </span>
            </td>
            <td class="px-4 py-2">{{ op.reason }}</td>
            <td class="px-4 py-2">
              <div class="flex justify-center gap-2">
                <!-- Edit -->
                <button @click="editSale(sale)" class="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-600 hover:text-white transition" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M11 4h2m2.121 2.121a3 3 0 010 4.243L9 16l-4 1 1-4 6.121-6.121a3 3 0 014.243 0z"/>
                  </svg>
                </button>

                <!-- Trash -->
                <button @click="trashSale(sale)" class="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition" title="Trash">
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
        Showing
        <span class="font-semibold">{{ (currentPage - 1) * perPage + 1 }}</span>
        to
        <span class="font-semibold">
          {{ Math.min(currentPage * perPage, totalOperations) }}
        </span>
        of
        <span class="font-semibold">{{ totalOperations }}</span>
      </div>

      <div class="flex gap-2">
        <button
          class="px-3 py-1 border rounded"
          @click="currentPage = Math.max(currentPage - 1, 1)"
        >
          &laquo;
        </button>
        <button
          v-for="n in Math.ceil(totalOperations / perPage)"
          :key="n"
          class="px-3 py-1 border rounded"
          @click="currentPage = n"
        >
          {{ n }}
        </button>
        <button
          class="px-3 py-1 border rounded"
          @click="currentPage = Math.min(currentPage + 1, Math.ceil(totalOperations / perPage))"
        >
          &raquo;
        </button>
      </div>
    </div>

  </div>
  
</div>
</template>
