<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

import FormSkeleton from '@/components/Skeleton/Form-1.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import ContactMenu from '@/components/inc/SubSidebar/ContactMenu.vue'
import { useMessageStore } from '@/stores/useMessageStore'

const messageStore = useMessageStore()
const route = useRoute()
const router = useRouter()

const rowId = route.params.id

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Suppliers', to: '/supplier' },
  { label: 'Edit Supplier' }
]

const processing = ref(false)
const loading = ref(true)

/* ===============================
  SINGLE ROW STATE
================================ */
const row = ref({})

/* ===============================
  FETCH TAX DATA
================================ */
const fetchRow = async () => {
  try {
    const res = await axiosInstance.get(`/suppliers/${rowId}`)
    const data = res.data.data
    row.value = {
      name: data.name,
      phone: data.phone,
      address: data.address,
      description: data.description,
      opening_balance: data.opening,
      status: data.status,
    }
  } catch (err) {
    messageStore.showError('Failed to load row data')
  } finally {
    loading.value = false
  }
}

/* ===============================
  UPDATE TAX
================================ */
const submitUpdate = async () => {
  if (processing.value) return

  processing.value = true

  try {
    await axiosInstance.put(`/suppliers/${rowId}`, row.value)
    messageStore.showSuccess('Row updated successfully!')
    router.push('/supplier')
  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Update failed')
    } else {
      messageStore.showError('Unexpected error occurred')
    }
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  fetchRow()
})

</script>

<template>
<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <ContactMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Title -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold text-gray-700">Edit Supplier</h2>

      <router-link
          to="/supplier"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          View All
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <FormSkeleton :columns="3" :rows="2" />
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submitUpdate" class="space-y-4">

      <!-- Row 1 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            v-model="row.phone"
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
            Status <span class="text-red-600">*</span>
          </label>
          <select
            v-model="row.status"
            class="w-full border p-3"
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
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

        <div class="md:col-span-2">
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
      </div>

      <button
        type="submit"
        :disabled="processing"
        class="w-full bg-gray-500 text-white font-semibold p-3 rounded
               hover:bg-gray-600 transition cursor-pointer
               disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ processing ? 'Updating...' : 'Update Supplier' }}
      </button>

    </form>

  </div>
</div>
</template>
