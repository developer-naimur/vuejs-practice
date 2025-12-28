<script setup>
import { ref, computed } from 'vue'
import ProductMenu from '@/components/inc/SubSidebar/ProductMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

// ------------------------
// Breadcrumb
// ------------------------
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Unit Lists' }
]

// ------------------------
// Units Data
// ------------------------
const units = ref([
  { id: 1, name: 'John Doe', status: 'Active' },
  { id: 2, name: 'Jane Smith', status: 'Pending' },
  { id: 3, name: 'Alex Brown', status: 'Inactive' },
  { id: 4, name: 'Mary Jane', status: 'Active' },
  { id: 5, name: 'Peter Parker', status: 'Pending' }
])

const trashUnits = ref([]) // soft deleted units

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

// Filtered & Paginated Units
const filteredUnits = computed(() => {
  return units.value
    .filter(unit => {
      const matchesSearch = unit.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesStatus = statusFilter.value ? unit.status === statusFilter.value : true
      return matchesSearch && matchesStatus
    })
    .slice((currentPage.value - 1) * perPage.value, currentPage.value * perPage.value)
})

const totalUnits = computed(() => units.value.length)
const totalPages = computed(() => Math.ceil(filteredUnits.value.length / perPage.value))

// ------------------------
// Status Classes
// ------------------------
const statusClass = status => {
  if (status === 'Active') return 'bg-green-500'
  if (status === 'Pending') return 'bg-yellow-500'
  return 'bg-red-500'
}

// ------------------------
// Actions
// ------------------------
const editUnit = unit => alert(`Edit ${unit.name}`)
const deleteUnit = unit => {
  if (confirm(`Are you sure you want to delete ${unit.name}?`)) {
    trashUnits.value.push(unit)
    units.value = units.value.filter(u => u.id !== unit.id)
  }
}
const createUnit = () => alert('Create new unit')
const viewTrash = () => alert('Soft deleted units: ' + trashUnits.value.map(u => u.name).join(', '))

// ------------------------
// Filters
// ------------------------
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

// ------------------------
// Export CSV
// ------------------------
const exportUnits = () => {
  const headers = ['ID', 'Name', 'Status']
  const csvRows = [headers.join(',')]

  units.value.forEach(u => {
    csvRows.push([u.id, u.name, u.status].join(','))
  })

  const csvString = csvRows.join('\n')
  const blob = new Blob([csvString], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'units.csv'
  link.click()
  URL.revokeObjectURL(url)
}

// ------------------------
// Import CSV
// ------------------------
const importUnits = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = e => {
    const lines = e.target.result.split('\n')
    lines.slice(1).forEach(line => {
      const [id, name, status] = line.split(',')
      if (id && name && status) {
        units.value.push({ id: Number(id), name, status })
      }
    })
  }
  reader.readAsText(file)
}
</script>

<template>
<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <ProductMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <!-- Title + Total -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">Unit Lists</h2>
        <span class="text-gray-600 font-medium">Total Units: {{ totalUnits }}</span>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 flex-wrap">
        <router-link to="/product/unit/create" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create
        </router-link>

        <router-link to="/product/unit/trashed" class="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
                     01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0
                     011-1h4a1 1 0 011 1v2" />
          </svg>
          Trash
        </router-link>

        <button @click="exportUnits" class="flex items-center gap-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4 16v4h16v-4M12 12v8m0 0l-4-4m4 4l4-4M12 4v8" />
          </svg>
          Export
        </button>

        <label class="flex items-center gap-2 px-4 py-2 rounded bg-yellow-400 text-white hover:bg-yellow-500 transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4 16v4h16v-4M12 12v8m0 0l-4-4m4 4l4-4M12 4v8" />
          </svg>
          Import
          <input type="file" class="hidden" accept=".csv" @change="importUnits" />
        </label>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-4 items-end">
      <div class="w-full md:w-1/3">
        <input v-model="searchQuery" type="text" placeholder="Search..."
               class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none" />
      </div>
      <div class="w-full md:w-1/5">
        <select v-model="statusFilter" class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none">
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
            <th class="px-4 py-2 text-left">Name</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(unit, index) in filteredUnits" :key="unit.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="px-4 py-2">{{ unit.name }}</td>
            <td class="px-4 py-2">
              <span class="px-3 py-1 rounded-full text-white text-sm" :class="statusClass(unit.status)">
                {{ unit.status }}
              </span>
            </td>
            <td class="px-4 py-2">
              <div class="flex justify-center gap-2">
                <button @click="editUnit(unit)" class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 4h2m2.121 2.121a3 3 0 010 4.243L9 16l-4 1 1-4 6.121-6.121a3 3 0 014.243 0z"/>
                  </svg>
                </button>
                <button @click="deleteUnit(unit)" class="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition" title="Delete">
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
        <span class="font-semibold">{{ Math.min(currentPage*perPage, filteredUnits.length) }}</span> of
        <span class="font-semibold">{{ totalUnits }}</span> entries
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="currentPage = Math.max(currentPage-1,1)">&laquo;</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100" v-for="n in Math.ceil(totalUnits/perPage)" :key="n" @click="currentPage=n">{{ n }}</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="currentPage = Math.min(currentPage+1, Math.ceil(totalUnits/perPage))">&raquo;</button>
      </div>
    </div>

  </div>
  
</div>
</template>
