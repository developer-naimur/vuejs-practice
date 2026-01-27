<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

import FormSkeleton from '@/components/Skeleton/Form-2.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import ContactMenu from '@/components/inc/SubSidebar/ContactMenu.vue'
import { useMessageStore } from '@/stores/useMessageStore'

const messageStore = useMessageStore()
const route = useRoute()
const router = useRouter()

const rowId = route.params.id

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Payment & Receives', to: '/payment-and-receive' },
  { label: 'Edit Payment & Receive' }
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
    const res = await axiosInstance.get(`/payment-and-receives/${rowId}`)
    const data = res.data.data
    
    let amount = ''
    if (Number(data.debit) > 0) {
      amount = data.debit
    } else if (Number(data.credit) > 0) {
      amount = data.credit
    }

    row.value = {
      transaction_date: data.date,
      payment_type: data.debit > 0
        ? 'payment'
        : data.credit > 0
          ? 'receive'
          : '',
      party_type: data.customer
        ? 'customer'
        : data.supplier
          ? 'supplier'
          : '',
      account_id: data.account?.id || '',
      customer_id: data.customer?.id || '',
      supplier_id: data.supplier?.id || '',
      amount: amount,
      cheque_number: data.cheque_number || '',
      note: data.note || '',
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
    await axiosInstance.put(`/payment-and-receives/${rowId}`, row.value)
    messageStore.showSuccess('Row updated successfully!')
    router.push('/payment-and-receive')
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

//load customers
const customers = ref([])
const customerLoading = ref<boolean>(false);
const loadCustomers = async () => {
  loading.value = true
  customerLoading.value = true
  try {
    const res = await axiosInstance.get('/customers/option/list')
    customers.value = res.data.data
  } catch (err) {
    messageStore.showError('Customer load failed. Please check permission.')
  } finally {
    customerLoading.value = false
    loading.value = false
  }
}
//load suppliers
const suppliers = ref([])
const supplierLoading = ref<boolean>(false);
const loadSuppliers = async () => {
  loading.value = true
  supplierLoading.value = true
  try {
    const res = await axiosInstance.get('/suppliers/option/list')
    suppliers.value = res.data.data
  } catch (err) {
    messageStore.showError('Supplier load failed. Please check permission.')
  } finally {
    supplierLoading.value = false
    loading.value = false
  }
}

onMounted(() => {
  loadAccounts()
  loadCustomers()
  loadSuppliers()
  fetchRow()
})

watch(
  () => row.value.party_type,
  (partyType) => {
    if (partyType === 'customer') {
      row.value.supplier_id = ''
      row.value.payment_type = 'receive'
    } else if (partyType === 'supplier') {
      row.value.customer_id = ''
      row.value.payment_type = 'payment'
    } else {
      row.value.customer_id = ''
      row.value.supplier_id = ''
      row.value.payment_type = ''
    }
  }
)


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
      <h2 class="text-2xl font-semibold text-gray-700">Edit Payment & Receive</h2>

      <router-link
          to="/supplier"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          View All
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <FormSkeleton :columns="3" :rows="3" />
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submitUpdate" class="space-y-4">

        <!-- Row 1 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Date <span class="text-red-600">*</span>
            </label>
            <input
              v-model="row.transaction_date"
              type="date"
              class="w-full border p-3 focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Party Type <span class="text-red-600">*</span>
            </label>
            <select
              v-model="row.party_type"
              class="w-full border p-3"
            >
              <option value="">Party Type</option>
              <option value="customer">Customer</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>


          <div
            class="relative group"
            :title="row.party_type !== 'customer'
              ? 'Please select Party Type: Customer'
              : ''"
          >
            <label
              class="block text-sm mb-1"
              :class="row.party_type !== 'customer'
                ? 'text-gray-400'
                : 'text-gray-600'"
            >
              Customer <span class="text-red-600">*</span>
            </label>

            <select
              v-model="row.customer_id"
              class="w-full border p-3 transition
                     disabled:bg-gray-100 disabled:text-gray-400
                     disabled:cursor-not-allowed"
              :disabled="row.party_type !== 'customer' || customerLoading || !customers.length"
            >
              <option value="">Select</option>
              <option
                v-for="customer in customers"
                :key="customer.id"
                :value="customer.id"
              >
                {{ customer.name }}
                <template v-if="customer.phone"> - {{ customer.phone }}</template>
              </option>
            </select>
          </div>

          <div
            class="relative group"
            :title="row.party_type !== 'supplier'
              ? 'Please select Party Type: Supplier'
              : ''"
          >
            <label
              class="block text-sm mb-1"
              :class="row.party_type !== 'supplier'
                ? 'text-gray-400'
                : 'text-gray-600'"
            >
              Supplier <span class="text-red-600">*</span>
            </label>

            <select
              v-model="row.supplier_id"
              class="w-full border p-3 transition
                     disabled:bg-gray-100 disabled:text-gray-400
                     disabled:cursor-not-allowed"
              :disabled="row.party_type !== 'supplier' || supplierLoading || !suppliers.length"
            >
              <option value="">Select</option>
              <option
                v-for="supplier in suppliers"
                :key="supplier.id"
                :value="supplier.id"
              >
                {{ supplier.name }}
                <template v-if="supplier.phone"> - {{ supplier.phone }}</template>
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Payment Type <span class="text-red-600">*</span>
            </label>
            <select
              v-model="row.payment_type"
              class="w-full border p-3"
            >
              <option value="">Payment Type</option>
              <option value="payment">Payment</option>
              <option value="receive">Receive</option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Account <span class="text-red-600">*</span>
            </label>
            <select
              v-model="row.account_id"
              class="w-full border p-3"
              :disabled="accountLoading || !accounts.length"
            >
              <option value="">Select</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.account_name }} <template v-if="account.account_number"> - {{ account.account_number }}</template>
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Amount <span class="text-red-600">*</span>
            </label>
            <input
              v-model="row.amount"
              type="number"
              placeholder="0.00"
              class="w-full border p-3"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Cheque Number
            </label>
            <input
              v-model="row.cheque_number"
              type="text"
              class="w-full border p-3"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Note
            </label>
            <textarea v-model="row.note" class="w-full border p-3"></textarea>
          </div>

        </div>

      <button
        type="submit"
        :disabled="processing"
        class="w-full bg-gray-500 text-white font-semibold p-3 rounded
               hover:bg-gray-600 transition cursor-pointer
               disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ processing ? 'Updating...' : 'Update Payment & Receive' }}
      </button>

    </form>

  </div>
</div>
</template>
