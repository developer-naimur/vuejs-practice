<script setup>
import { ref, computed } from 'vue'
import SettingsMenu from '@/components/inc/SubSidebar/SettingsMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

// ------------------------
// Breadcrumb
// ------------------------
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Role Lists' }
]

// ------------------------
// rows
// ------------------------
const rows = ref([
  { id: 1, name: 'John Doe', status: 'Active' },
  { id: 2, name: 'Jane Smith', status: 'Pending' },
  { id: 3, name: 'Alex Brown', status: 'Inactive' },
  { id: 4, name: 'Mary Jane', status: 'Active' },
  { id: 5, name: 'Peter Parker', status: 'Pending' }
])

const trashRows = ref([]) // soft deleted rows

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

// Filtered & Paginated rows
const filteredRows = computed(() => {
  return rows.value
    .filter(row => {
      const matchesSearch = row.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesStatus = statusFilter.value ? row.status === statusFilter.value : true
      return matchesSearch && matchesStatus
    })
    .slice((currentPage.value - 1) * perPage.value, currentPage.value * perPage.value)
})

const totalRows = computed(() => rows.value.length)
const totalPages = computed(() => Math.ceil(filteredRows.value.length / perPage.value))

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
const editRow = row => alert(`Edit ${row.name}`)
const deleteRow = row => {
  if (confirm(`Are you sure you want to delete ${row.name}?`)) {
    trashRows.value.push(row)
    rows.value = rows.value.filter(u => u.id !== row.id)
  }
}
const viewTrash = () => alert('Soft deleted rows: ' + trashRows.value.map(u => u.name).join(', '))

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
const exportRow= () => {
  const headers = ['ID', 'Name', 'Status']
  const csvRows = [headers.join(',')]

  rows.value.forEach(u => {
    csvRows.push([u.id, u.name, u.status].join(','))
  })

  const csvString = csvRows.join('\n')
  const blob = new Blob([csvString], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'rows.csv'
  link.click()
  URL.revokeObjectURL(url)
}

// ------------------------
// Import CSV
// ------------------------
const importRow = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = e => {
    const lines = e.target.result.split('\n')
    lines.slice(1).forEach(line => {
      const [id, name, status] = line.split(',')
      if (id && name && status) {
        rows.value.push({ id: Number(id), name, status })
      }
    })
  }
  reader.readAsText(file)
}
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
        <h2 class="text-2xl font-semibold text-gray-700">Role Lists</h2>
        <span class="text-gray-600 font-medium">Total Roles: {{ totalRows }}</span>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 flex-wrap">

      	<router-link
		  to="/setting/user"
		  class="flex items-center gap-2 px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition"
		>
		  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
		       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
		    <path stroke-linecap="round" stroke-linejoin="round"
		          d="M5.121 17.804A13.937 13.937 0 0112 16
		             c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0
		             3 3 0 016 0z"/>
		  </svg>
		  Users
		</router-link>

        <router-link to="/setting/user/role/create" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create
        </router-link>

        <router-link to="/setting/user/role/trashed" class="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
                     01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0
                     011-1h4a1 1 0 011 1v2" />
          </svg>
          Trash
        </router-link>

        <button @click="exportRow" class="flex items-center gap-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer">
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
          <input type="file" class="hidden" accept=".csv" @change="importRow" />
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
          <tr v-for="(row, index) in filteredRows" :key="row.id" class="hover:bg-gray-50">
            <td class="px-4 py-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
            <td class="px-4 py-2">{{ row.name }}</td>
            <td class="px-4 py-2">
              <span class="px-3 py-1 rounded-full text-white text-sm" :class="statusClass(row.status)">
                {{ row.status }}
              </span>
            </td>
            <td class="px-4 py-2">
              <div class="flex justify-center gap-2">
                <button @click="editRow(row)" class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 4h2m2.121 2.121a3 3 0 010 4.243L9 16l-4 1 1-4 6.121-6.121a3 3 0 014.243 0z"/>
                  </svg>
                </button>
                <button @click="deleteRow(row)" class="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition" title="Delete">
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
        <span class="font-semibold">{{ Math.min(currentPage*perPage, filteredRows.length) }}</span> of
        <span class="font-semibold">{{ totalRows }}</span> entries
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="currentPage = Math.max(currentPage-1,1)">&laquo;</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100" v-for="n in Math.ceil(totalRows/perPage)" :key="n" @click="currentPage=n">{{ n }}</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="currentPage = Math.min(currentPage+1, Math.ceil(totalRows/perPage))">&raquo;</button>
      </div>
    </div>

  </div>

</div>
</template>
