<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
  { label: 'Fund Transfers', to: '/account/fund-transfer' },
  { label: 'Edit Transfer' }
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
    const res = await axiosInstance.get(`/account-fund-transfers/${rowId}`)
    const data = res.data.data
    row.value = {
      transfer_date: data.transfer_date,
      from_account_id: data.from_account.id,
      to_account_id: data.to_account.id,
      amount: data.amount,
      note: data.note
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
    await axiosInstance.put(`/account-fund-transfers/${rowId}`, row.value)
    messageStore.showSuccess('Row updated successfully!')
    router.push('/account/fund-transfer')
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

//load accounts
const accounts = ref([])
const accountLoading = ref<boolean>(false);
const loadAccounts = async () => {
  loading.value = true
  accountLoading.value = true
  try {
    const res = await axiosInstance.get('/accounts/option/list')
    accounts.value = res.data.data
  } catch (err) {
    messageStore.showError('Account load failed. Please check permission.')
  } finally {
    accountLoading.value = false
    loading.value = false
  }
}

watch(
  () => row.value.from_account_id,
  (newVal, oldVal) => {
    if (row.value.to_account_id === newVal) {
      row.value.to_account_id = ''
    }
  }
)
onMounted(() => {
  loadAccounts()
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
      <h2 class="text-2xl font-semibold text-gray-700">Edit Fund Transfer</h2>

      <router-link
        to="/account/fund-transfer"
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
              Transfer Date <span class="text-red-600">*</span>
            </label>
            <input
              v-model="row.transfer_date"
              type="date"
              class="w-full border p-3"
            />
          </div>

          <!-- From Account -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              From Account <span class="text-red-600">*</span>
            </label>
            <select
              v-model="row.from_account_id"
              class="w-full border p-3"
              :disabled="accountLoading || !accounts.length"
            >
              <option value="">Select</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.account_name }} <template v-if="account.account_number"> - {{ account.account_number }}</template>
              </option>
            </select>
          </div>

          <!-- To Account -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              To Account <span class="text-red-600">*</span>
            </label>
            <select
              v-model="row.to_account_id"
              class="w-full border p-3"
              :disabled="accountLoading || !accounts.length"
            >
              <option value="">Select</option>
              <option 
                  v-for="account in accounts" 
                  :key="account.id" 
                  :value="account.id" 
                  :disabled="account.id === row.from_account_id"
                >
                  {{ account.account_name }} <template v-if="account.account_number"> - {{ account.account_number }}</template>
              </option>
            </select>
          </div>

          <!-- Opening Amount -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Transfer Amount <span class="text-red-600">*</span>
            </label>
            <input
              v-model="row.amount"
              type="number"
              placeholder="0.00"
              class="w-full border p-3"
            />
          </div>

        </div>

        <!-- Row 2 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

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
        {{ processing ? 'Updating...' : 'Update Fund Transfer' }}
      </button>

    </form>

  </div>
</div>
</template>
