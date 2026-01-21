<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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

// ------------------------
// Breadcrumb
// ------------------------
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Role Lists' }
]


// ------------------------
// Permission Modal
// ------------------------
const showPermissionModal = ref(false)
const selectedRole = ref(null)

const permissions = ref({
  sales: { c: false, r: false, u: false, d: false },
  sales_return: { c: false, r: false, u: false, d: false },
  purchase: { c: false, r: false, u: false, d: false },
  purchase_return: { c: false, r: false, u: false, d: false },

  products: { c: false, r: false, u: false, d: false },
  categories: { c: false, r: false, u: false, d: false },
  brands: { c: false, r: false, u: false, d: false },
  units: { c: false, r: false, u: false, d: false },

  customer: { c: false, r: false, u: false, d: false },
  supplier: { c: false, r: false, u: false, d: false },

  stock_operation: { c: false, r: false, u: false, d: false },
  opening_accounts: { c: false, r: false, u: false, d: false },
  fund_transfer: { c: false, r: false, u: false, d: false },
  others_income_expense: { c: false, r: false, u: false, d: false },
  others_income_expense_type: { c: false, r: false, u: false, d: false },

  // Reports
  purchase_report: { c: false, r: false, u: false, d: false },
  sales_report: { c: false, r: false, u: false, d: false },
  stock_report: { c: false, r: false, u: false, d: false },
  accounts_report: { c: false, r: false, u: false, d: false },
  customer_report: { c: false, r: false, u: false, d: false },
  supplier_report: { c: false, r: false, u: false, d: false }
})

// ------------------------
// Modal Actions
// ------------------------
const openPermissionModal = (role) => {
  selectedRole.value = role
  showPermissionModal.value = true
}

const closePermissionModal = () => {
  showPermissionModal.value = false
}


/* ===============================
   GLOBAL SELECT ALL
================================ */
const isGlobalAllChecked = computed(() => {
  return Object.entries(permissions.value).every(([menu, perms]) => {
    if (menu.includes('_report')) {
      // Only consider READ for reports
      return perms.r === true
    }
    // For other menus, check all CRUD
    return Object.values(perms).every(v => v === true)
  })
})

const toggleAllPermissions = (value) => {
  Object.keys(permissions.value).forEach(menu => {
    if (menu.includes('_report')) {
      // For reports, only toggle 'r', leave c/u/d unchanged
      permissions.value[menu].r = value
    } else {
      // For other menus, toggle all CRUD
      toggleMenuAll(menu, value)
    }
  })
}

/* ===============================
   MENU-WISE ALL
================================ */
const isMenuAllChecked = (menu) => {
  return Object.values(permissions.value[menu]).every(v => v === true)
}

const toggleMenuAll = (menu, value) => {
  Object.keys(permissions.value[menu]).forEach(key => {
    permissions.value[menu][key] = value
  })
}

/* ===============================
   CRUD ↔ MENU ALL SYNC
================================ */
const syncMenuAll = () => {
  // computed automatically syncs
}

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
    const res = await axiosInstance.get('/roles', {
      params: {
        name: searchValue.value || undefined,
        status: statusValue.value || undefined,
        page: currentPage.value,
        per_page: perPage.value,
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
  Soft Delete
================================ */
import { useSoftDeleteStore } from '@/stores/useSoftDeleteStore'
const deleteStore = useSoftDeleteStore()
const deleteRow = (row) => {
  row.deleteUrl = `/roles/${row.uuid}`
  row.onSuccess = fetchRows
  row.label = row.role_name || 'this item'
  deleteStore.openDeleteModal(row)
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
        <h2 class="text-2xl font-semibold text-gray-700">Role Lists</h2>
        <span class="text-gray-600 font-medium">Totals: {{ totalRows }}</span>
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
            <td class="px-4 py-2">{{ row.role_name }}</td>
            <td class="px-4 py-2">
              <span class="px-3 py-1 rounded-full text-white text-sm" :class="statusClass(row.status)">
                {{ row.status }}
              </span>
            </td>
            <td class="px-4 py-2">
              <div class="flex justify-center gap-2">
                <button
                  @click="openPermissionModal(row)"
                  class="p-2 rounded-full bg-purple-100 text-purple-600
                         hover:bg-purple-600 hover:text-white transition cursor-pointer"
                  title="Set Permission"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                       fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3
                             1.343-3 3-3 3 1.343 3 3zm0 0
                             c0 1.657 1.343 3 3 3s3-1.343 3-3
                             -1.343-3-3-3-3 1.343-3 3z"/>
                  </svg>
                </button>


                <router-link :to="`/setting/user/role/${row.uuid}/edit`" class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 4h2m2.121 2.121a3 3 0 010 4.243L9 16l-4 1 1-4 6.121-6.121a3 3 0 014.243 0z"/>
                  </svg>
                </router-link>
                <button @click="deleteRow(row)" class="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              </div>
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



    <!-- ================= PERMISSION MODAL ================= -->
    <div v-if="showPermissionModal"
         class="fixed inset-0 bg-black/60 flex items-center justify-center z-100">

      <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full h-[70vh] flex flex-col">

        <!-- Header -->
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700">
            Permissions for: 
            <span class="text-blue-600 font-bold bg-blue-100 px-1 rounded">
              {{ selectedRole?.role_name }}
            </span>
          </h3>
          <button @click="closePermissionModal"
                  class="text-gray-500 hover:text-red-600 text-2xl font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <!-- Global Select -->
        <div class="flex items-center gap-2 px-6 py-3 border-b border-gray-200 bg-gray-50">
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox"
                   class="sr-only"
                   :checked="isGlobalAllChecked"
                   @change="toggleAllPermissions($event.target.checked)">
            
            <div :class="['w-5 h-5 flex items-center justify-center rounded-full border-2 transition-all',
                         isGlobalAllChecked ? 'border-blue-600' : 'border-gray-300',
                         'bg-white']">
              <!-- Tick mark controlled by Vue state -->
              <svg v-if="isGlobalAllChecked"
                   class="w-3 h-3 text-blue-600"
                   viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z" clip-rule="evenodd"/>
              </svg>
            </div>
            
            <span class="ml-2 select-none">Select All Permissions</span>
          </label>
        </div>

        <!-- Permission Table -->
        <div class="flex-1 overflow-auto px-6 py-4">
          <table class="w-full border-collapse border border-gray-200 text-sm">
            <thead class="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th class="p-2 text-left font-medium text-gray-700">MENU</th>
                <th class="p-2 text-center font-medium text-gray-700">ALL</th>
                <th class="p-2 text-center font-medium text-gray-700">CREATE</th>
                <th class="p-2 text-center font-medium text-gray-700">READ</th>
                <th class="p-2 text-center font-medium text-gray-700">UPDATE</th>
                <th class="p-2 text-center font-medium text-gray-700">DELETE</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(perm, menu) in permissions" :key="menu"
                  class="border-t hover:bg-gray-50 transition-colors">

                <!-- Menu Name -->
                <td class="p-2 font-medium capitalize text-gray-700">
                  {{ menu.replaceAll('_', ' ') }}
                </td>

                <!-- Menu All -->
                <td class="p-2 text-center">
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox"
                           class="sr-only"
                           :checked="isMenuAllChecked(menu)"
                           :disabled="menu.includes('_report')" 
                           @change="toggleMenuAll(menu, $event.target.checked)">

                    <div :class="[
                          'w-5 h-5 flex items-center justify-center rounded-full border-2 transition-all bg-white',
                          isMenuAllChecked(menu) ? 'border-blue-600' : 'border-gray-300',
                          menu.includes('_report') ? 'opacity-50 cursor-not-allowed' : ''
                        ]">
                      <svg v-if="isMenuAllChecked(menu)"
                           class="w-3 h-3 text-blue-600"
                           viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </label>
                </td>

                <!-- CREATE -->
                <td class="p-2 text-center">
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only" v-model="perm.c"
                           :disabled="menu.includes('_report')">
                    <div :class="[
                          'w-5 h-5 flex items-center justify-center rounded-full border-2 transition-colors duration-200 bg-white',
                          perm.c ? 'border-blue-600' : 'border-gray-300',
                          menu.includes('_report') ? 'opacity-50 cursor-not-allowed' : ''
                        ]">
                      <svg v-if="perm.c" class="w-3 h-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </label>
                </td>

                <!-- READ -->
                <td class="p-2 text-center">
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only" v-model="perm.r" @change="syncMenuAll(menu)">
                    <div :class="[
                          'w-5 h-5 flex items-center justify-center rounded-full border-2 transition-colors duration-200 bg-white',
                          perm.r ? 'border-blue-600' : 'border-gray-300'
                        ]">
                      <svg v-if="perm.r" class="w-3 h-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </label>
                </td>

                <!-- UPDATE -->
                <td class="p-2 text-center">
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only" v-model="perm.u"
                           :disabled="menu.includes('_report')">
                    <div :class="[
                          'w-5 h-5 flex items-center justify-center rounded-full border-2 transition-colors duration-200 bg-white',
                          perm.u ? 'border-blue-600' : 'border-gray-300',
                          menu.includes('_report') ? 'opacity-50 cursor-not-allowed' : ''
                        ]">
                      <svg v-if="perm.u" class="w-3 h-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </label>
                </td>

                <!-- DELETE -->
                <td class="p-2 text-center">
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only" v-model="perm.d"
                           :disabled="menu.includes('_report')">
                    <div :class="[
                          'w-5 h-5 flex items-center justify-center rounded-full border-2 transition-colors duration-200 bg-white',
                          perm.d ? 'border-blue-600' : 'border-gray-300',
                          menu.includes('_report') ? 'opacity-50 cursor-not-allowed' : ''
                        ]">
                      <svg v-if="perm.d" class="w-3 h-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </label>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button @click="closePermissionModal"
                  class="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer">
            Cancel
          </button>
          <button
            class="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer">
            Save Permissions
          </button>
        </div>

      </div>
    </div>
    <!-- ================= END PERMISSION MODAL ================= -->



</div>
</template>
