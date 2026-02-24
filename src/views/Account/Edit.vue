<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

import FormSkeleton from '@/components/Skeleton/Form-1.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import AccountMenu from '@/components/inc/SubSidebar/AccountMenu.vue'
import { useMessageStore } from '@/stores/useMessageStore'

const messageStore = useMessageStore()
const route = useRoute()
const router = useRouter()

const rowId = route.params.id

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Accounts', to: '/account' },
  { label: 'Edit Account' }
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
    const res = await axiosInstance.get(`/accounts/${rowId}`)
    const data = res.data.data
    row.value = {
      date: data.date,
      payment_method_id: data.payment_method_id,
      account_name: data.account_name,
      account_number: data.account_number,
      branch: data.branch_name,
      opening_balance: data.opening,
      note: data.description
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
    await axiosInstance.put(`/accounts/${rowId}`, row.value)
    messageStore.showSuccess('Row updated successfully!')
    router.push('/account')
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

//load payment methods
const payment_methods = ref([])
const paymentMethodLoading = ref<boolean>(false);
const loadPaymentMethods = async () => {
  loading.value = true
  paymentMethodLoading.value = true
  try {
    const res = await axiosInstance.get('/payment-methods/option/list')
    payment_methods.value = res.data.data
  } catch (err) {
    messageStore.showError('Payment Method load failed. Please check permission.')
  } finally {
    paymentMethodLoading.value = false
    loading.value = false
  }
}
onMounted(() => {
  loadPaymentMethods()
  fetchRow()
})

</script>

<template>
<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <AccountMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Title -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold text-gray-700">Edit Account</h2>

      <router-link
        to="/account"
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


        <!-- Date -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">
            Date <span class="text-red-600">*</span>
          </label>
          <input
            v-model="row.date"
            type="date"
            class="w-full border p-3"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">
            Payment Method <span class="text-red-600">*</span>
          </label>
          <select
            v-model="row.payment_method_id"
            class="w-full border p-3"
            :disabled="paymentMethodLoading || !payment_methods.length"
          >
            <option value="">Select</option>
            <option v-for="payment_method in payment_methods" :key="payment_method.id" :value="payment_method.id">
              {{ payment_method.method_name }}
            </option>
          </select>
        </div>

          <!-- Account Name -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Account Name <span class="text-red-600">*</span>
            </label>
            <input
              v-model="row.account_name"
              type="text"
              class="w-full border p-3"
              placeholder="Account Name"
            />
          </div>

          <!-- Account Number -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Account Number
            </label>
            <input
              v-model="row.account_number"
              type="text"
              class="w-full border p-3"
              placeholder="Account Number"
            />
          </div>

          <!-- Opening Amount -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Opening Amount
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
              Branch
            </label>
            <input
              v-model="row.branch"
              type="text"
              class="w-full border p-3"
              placeholder="Branch"
            />
          </div>

          <!-- Note -->
          <div class="md:col-span-2">
            <label class="block text-sm text-gray-600 mb-1">
              Note
            </label>
            <textarea
              v-model="row.note"
              rows="2"
              placeholder="Optional note"
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
        {{ processing ? 'Updating...' : 'Update Account' }}
      </button>

    </form>

  </div>
</div>
</template>
