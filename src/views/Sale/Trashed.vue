<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TableSkeleton from '@/components/Skeleton/Table.vue'
import SalesMenu from '@/components/inc/SubSidebar/SalesMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import { $routes, $labels } from '@/constants/sale'


/* =====================================================
   BREADCRUMB
===================================================== */
const $breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: $labels.singular_name + ' Trash Lists' }
]

/* =====================================================
   TABLE STATE
===================================================== */
const $currentPage = ref(1)
const $perPage = ref(5)

/* =====================================================
   FILTERS
===================================================== */
const $searchText = ref('')
const $statusValue = ref('')

/* =====================================================
   DATA (API READY)
===================================================== */
const $rows = ref([])

/* future API loader */
const loadData = async () => {
  // replace with axios later
  $rows.value = [
    { id: 1, reference: 'S-1001', customer: 'John Doe', total: 250, date: '2025-12-20', status: 'Completed' },
    { id: 2, reference: 'S-1002', customer: 'Jane Smith', total: 150, date: '2025-12-21', status: 'Pending' },
    { id: 3, reference: 'S-1003', customer: 'Alex Brown', total: 300, date: '2025-12-21', status: 'Cancelled' },
    { id: 4, reference: 'S-1004', customer: 'Mary Jane', total: 400, date: '2025-12-22', status: 'Completed' },
    { id: 5, reference: 'S-1005', customer: 'Peter Parker', total: 500, date: '2025-12-22', status: 'Pending' }
  ]
}
onMounted(loadData)

/* =====================================================
   COMPUTED
===================================================== */
const $rowsFiltered = computed(() => {
  return $rows.value.filter(r => {
    const matchSearch =
      r.reference.toLowerCase().includes($searchText.value.toLowerCase())
    const matchStatus =
      $statusValue.value ? r.status === $statusValue.value : true
    return matchSearch && matchStatus
  })
})

const $rowsPaginated = computed(() => {
  const start = ($currentPage.value - 1) * $perPage.value
  return $rowsFiltered.value.slice(start, start + $perPage.value)
})

const $totalItems = computed(() => $rows.value.length)
const $totalPages = computed(() =>
  Math.ceil($rowsFiltered.value.length / $perPage.value)
)

/* =====================================================
   ACTIONS
===================================================== */
const editItem = item => alert(`Edit ${item.name}`)
const deleteItem = item => {
  if (confirm(`Delete ${item.name}?`)) {
    $rows.value = $rows.value.filter(r => r.id !== item.id)
  }
}

const resetFilters = () => {
  $searchText.value = ''
  $statusValue.value = ''
  $currentPage.value = 1
}
</script>

<template>
<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <SalesMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4">

    <Breadcrumb :items="$breadcrumbs" />

    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <!-- Title + Total -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">{{ $labels.singular_name }} Trash Lists</h2>
        <span class="text-gray-600 font-medium">Total {{ $labels.plural_name }}: {{ $totalItems }}</span>
      </div>

      <div class="flex gap-2 flex-wrap">

        <router-link :to="$routes.index" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition cursor-pointer">
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
        <input v-model="$searchText" placeholder="Search..." class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none" />

      </div>
      <div class="w-full md:w-1/5">
        <select v-model="$statusValue" class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none">
          <option value="">Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Pending</option>
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
            <th class="px-4 py-2 text-right">Total</th>
            <th class="px-4 py-2 text-left">Date</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">

          <TableSkeleton :colspan="100" />
          
          <tr v-for="(row, i) in $rowsPaginated" :key="row.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">{{ ($currentPage-1)*$perPage + i + 1 }}</td>
            
             <td class="px-4 py-2 font-medium">
              {{ row.reference }}
            </td>

            <td class="px-4 py-2">
              {{ row.customer }}
            </td>

            <td class="px-4 py-2 text-right">
              ৳ {{ row.total }}
            </td>

            <td class="px-4 py-2">
              {{ row.date }}
            </td>

            <!-- Status -->
            <td class="px-4 py-2">
              <span
                class="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full"
                :class="{
                  'bg-green-500': row.status === 'Completed',
                  'bg-yellow-500': row.status === 'Pending',
                  'bg-red-500': row.status === 'Cancelled'
                }"
              >
                {{ row.status }}
              </span>
            </td>

            <td class="px-4 py-2 text-center">
              <div class="flex justify-center gap-2">
                <button @click="editItem(row)" class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 4h2m2.121 2.121a3 3 0 010 4.243L9 16l-4 1 1-4 6.121-6.121a3 3 0 014.243 0z"/>
                    </svg>
                  </button>
                  <button @click="deleteItem(row)" class="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition" title="Delete">
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
      <span>Page {{ $currentPage }} of {{ $totalPages }}</span>
      <div class="flex gap-2">
        <button @click="$currentPage--" :disabled="$currentPage===1">«</button>
        <button v-for="n in $totalPages" :key="n" @click="$currentPage=n">{{ n }}</button>
        <button @click="$currentPage++" :disabled="$currentPage===$totalPages">»</button>
      </div>
    </div>

  </div>
</div>
</template>
