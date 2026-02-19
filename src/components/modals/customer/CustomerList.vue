<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

import TableSkeleton from '@/components/Skeleton/Table.vue'
import Pagination from '@/components/Pagination.vue'

import { useMessageStore } from '@/stores/useMessageStore'
import { usePagination } from '@/composables/usePagination'

// child modal
import CustomerCreateForm from '@/components/modals/Customer/CustomerCreateForm.vue'

/* ===============================
  PROPS & EMITS
================================ */
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'selected'])

const closeModal = () => {
  emit('update:modelValue', false)
}

/* ===============================
  STORE
================================ */
const messageStore = useMessageStore()

/* ===============================
  PAGINATION
================================ */
const {
  currentPage,
  perPage,
  lastPage,
  setMeta,
  changePage,
} = usePagination(10)

/* ===============================
  FILTERS
================================ */
const nameValue = ref('')
const phoneValue = ref('')

/* ===============================
  DATA
================================ */
const rows = ref<any[]>([])
const totalRows = ref(0)
const loading = ref(false)

/* ===============================
  FETCH
================================ */
const fetchRows = async () => {
  loading.value = true
  try {
    const res = await axiosInstance.get('/customers/option/list', {
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
  currentPage.value = 1
  fetchRows()
}

const selectCustomer = (Customer: any) => {
  emit('selected', Customer)
  closeModal()
}

/* ===============================
  CREATE Customer
================================ */
const showCreateModal = ref(false)

const onCustomerSaved = async () => {
  showCreateModal.value = false
  await fetchRows()
}

/* ===============================
  INIT
================================ */
onMounted(fetchRows)
</script>
<template>
  <!-- ================= Customer POPUP ================= -->
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[70vh] flex flex-col">

      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h3 class="text-xl font-semibold text-gray-700">Select Customer</h3>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-red-600 text-2xl"
        >
          ✕
        </button>
      </div>

      <!-- Filters -->
      <div class="px-4 py-3 border-b border-gray-200 bg-gray-50 flex gap-3 items-end">
        <div class="w-full md:w-1/3">
          <input
            v-model="nameValue"
            type="text"
            placeholder="Name..."
            class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none"
          />
        </div>

        <div class="w-full md:w-1/3">
          <input
            v-model="phoneValue"
            type="text"
            placeholder="Phone..."
            class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none"
          />
        </div>

        <div class="flex gap-2 w-full md:w-auto">
          <button
            @click="handleSearch"
            class="flex items-center gap-2 px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-800 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/>
            </svg>
            Search
          </button>

          <button
            @click="resetFilters"
            class="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Cancel
          </button>

          <button
            @click="showCreateModal = true"
            class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 4v16m8-8H4"/>
            </svg>
            Create
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="flex-1 p-4 overflow-hidden">
        <div class="border border-gray-200 h-full overflow-hidden flex flex-col">
          <div class="flex-1 overflow-y-auto">
            <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
              <thead class="bg-gray-100 sticky top-0">
                <tr>
                  <th class="px-4 py-2">Name</th>
                  <th class="px-4 py-2">Phone</th>
                  <th class="px-4 py-2">Address</th>
                  <th class="px-4 py-2 text-center w-24">Select</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200">
                <TableSkeleton v-if="loading" :colspan="4" />

                <tr
                  v-for="row in rows"
                  :key="row.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-2 font-medium">{{ row.name }}</td>
                  <td class="px-4 py-2 text-gray-600">{{ row.phone }}</td>
                  <td class="px-4 py-2 text-gray-500">{{ row.address }}</td>
                  <td class="px-4 py-2 text-center">
                    <button
                      @click="selectCustomer(row)"
                      class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M5 13l4 4L19 7"/>
                      </svg>
                    </button>
                  </td>
                </tr>

                <tr v-if="!loading && rows.length === 0">
                  <td colspan="4" class="text-center py-6 text-gray-400">
                    No customer found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 px-6 py-3 flex justify-end">
        <button
          @click="closeModal"
          class="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M5 13l4 4L19 7"/>
          </svg>
          Done
        </button>
      </div>
    </div>

    <!-- CREATE Customer MODAL -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000]"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-xl">
        <CustomerCreateForm
          @saved="onCustomerSaved"
          @cancel="showCreateModal = false"
        />
      </div>
    </div>
  </div>
</template>
