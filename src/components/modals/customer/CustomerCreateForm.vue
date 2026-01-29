<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'
import { useMessageStore } from '@/stores/useMessageStore'
import { $routes, $labels } from '@/constants/customer'

const messageStore = useMessageStore()

const emit = defineEmits(['saved', 'cancel'])

/* =====================================================
   Add Row (same as your page)
===================================================== */
const newRows = ref([
  {
    name: '',
    status: '',
    phone: '',
    address: '',
    opening_balance: '',
    route_id: '',
    price_group_id: '',
    description: ''
  }
])

const addRowField = () =>
  newRows.value.push({
    name: '',
    status: '',
    phone: '',
    address: '',
    opening_balance: '',
    route_id: '',
    price_group_id: '',
    description: ''
  })


const copyRowField = (index) => {
  const rowToCopy = { ...newRows.value[index] }
  newRows.value.splice(index + 1, 0, rowToCopy)
}

const removeRowField = (index) => {
  if (newRows.value.length > 1) {
    newRows.value.splice(index, 1)
  }
}

/* =====================================================
   Submit
===================================================== */
const processing = ref(false)

const submitRows = async () => {
  if (processing.value) return
  processing.value = true

  try {
    await axiosInstance.post('/customers', {
      rows: newRows.value
    })

    messageStore.showSuccess('Row created successfully!')
    emit('saved') // 🔥 IMPORTANT

    newRows.value = ({
      name: '',
      status: '',
      phone: '',
      address: '',
      opening_balance: '',
      route_id: '',
      price_group_id: '',
      description: ''
    })

  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Error')
    } else {
      messageStore.showError('Unexpected error')
    }
  } finally {
    processing.value = false
  }
}


//load routes
const routes = ref([])
const routeLoading = ref<boolean>(false);
const loadRoute = async () => {
  processing.value = true
  routeLoading.value = true
  try {
    const res = await axiosInstance.get('/routes/option/list')
    routes.value = res.data.data
  } catch (err) {
    messageStore.showError('Route load failed. Please check permission.')
  } finally {
    routeLoading.value = false
    processing.value = false
  }
}

//load price groups
const price_groups = ref([])
const priceGroupLoading = ref<boolean>(false);
const loadPriceGroup = async () => {
  processing.value = true
  priceGroupLoading.value = true
  try {
    const res = await axiosInstance.get('/price-groups/option/list')
    price_groups.value = res.data.data
  } catch (err) {
    messageStore.showError('Price Group load failed. Please check permission.')
  } finally {
    priceGroupLoading.value = false
    processing.value = false
  }
}

onMounted(() => {
  loadRoute()
  loadPriceGroup()
})

</script>
<template>

  <form @submit.prevent="submitRows" class="space-y-4">

  <div
    v-for="(row, index) in newRows"
    :key="index"
    class="bg-white pb-5 border-b border-gray-200 transition relative space-y-4"
  >

    <!-- Row 1 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm text-gray-600 mb-1">
        Name <span class="text-red-600">*</span>
        </label>
        <input
          v-model="row.name"
          type="text"
          placeholder="Name *"
          class="w-full border p-3 focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Phone
        </label>
        <input
          v-model="row.phone "
          type="text"
          placeholder="Phone number"
          class="w-full border p-3"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Opening Balance
        </label>
        <input
          v-model="row.opening_balance"
          type="number"
          placeholder="0.00"
          class="w-full border p-3"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Price Group <span class="text-red-600">*</span>
        </label>
        <select
          v-model="row.price_group_id"
          class="w-full border p-3"
          :disabled="priceGroupLoading || !price_groups.length"
        >
          <option value="">Select</option>
          <option v-for="price_group in price_groups" :key="price_group.id" :value="price_group.id">
            {{ price_group.group_name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Area/Route <span class="text-red-600">*</span>
        </label>
        <select
          v-model="row.route_id"
          class="w-full border p-3"
          :disabled="routeLoading || !routes.length"
        >
          <option value="">Select</option>
          <option v-for="route in routes" :key="route.id" :value="route.id">
            {{ route.route_name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Address
        </label>
        <input
          v-model="row.address"
          type="text"
          placeholder="Address"
          class="w-full border p-3"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Description
        </label>
        <textarea
          v-model="row.description"
          rows="2"
          placeholder="Optional notes"
          class="w-full border p-3"
        ></textarea>
      </div>
      
      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Status <span class="text-red-600">*</span>
        </label>
        <select
          v-model="row.status"
          class="w-full border p-3"
        >
          <option value="">Select</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

    </div>

    <!-- ACTION BUTTONS (SAME STYLE AS PRODUCT FORM) -->
    <div class="w-36 flex gap-2">

      <!-- Remove -->
      <button
        type="button"
        @click="removeRowField(index)"
        :disabled="newRows.length === 1"
        class="w-12 h-12 flex items-center justify-center rounded-md
               bg-red-100 text-red-600 hover:bg-red-600 hover:text-white
               transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        title="Remove row"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Copy -->
      <button
        v-if="index === newRows.length - 1"
        type="button"
        @click="copyRowField(index)"
        class="w-12 h-12 flex items-center justify-center rounded-md
               bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
        title="Copy & Add"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2"/>
          <rect x="8" y="8" width="12" height="12" rx="2" ry="2"/>
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 12v4m2-2h-4"/>
        </svg>
      </button>

      <!-- Add -->
      <button
        v-if="index === newRows.length - 1"
        type="button"
        @click="addRowField"
        class="w-12 h-12 flex items-center justify-center rounded-md
               bg-green-500 text-white cursor-pointer"
        title="Add row"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 4v16m8-8H4"/>
        </svg>
      </button>

    </div>

  </div>

  <!-- Submit -->
    <div class="flex justify-end gap-2 pt-4">
      <button type="button" @click="$emit('cancel')" class="px-4 py-2 bg-gray-200 cursor-pointer">
        Cancel
      </button>

      <button type="submit"
              :disabled="processing"
              class="px-4 py-2 bg-gray-600 text-white cursor-pointer">
        {{ processing ? 'Saving...' : 'Saved' }}
      </button>
    </div>

</form>

</template>
