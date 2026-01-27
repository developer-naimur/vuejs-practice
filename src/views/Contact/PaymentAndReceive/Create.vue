<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import FormSkeleton from '@/components/skeleton/Form-2.vue'
import ContactMenu from '@/components/inc/SubSidebar/ContactMenu.vue'
import { $routes, $labels } from '@/constants/payment-and-receive'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

import { useMessageStore } from '@/stores/useMessageStore'
const messageStore = useMessageStore()

import { useRouter } from 'vue-router';
import axiosInstance from '@/axiosInstance';
import { AxiosError } from "axios";

import { useUserStore } from "@/stores/useUserStore";
const userStore = useUserStore();
const router = useRouter();

/* =====================================================
   BREADCRUMB
===================================================== */
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: $labels.plural_name, to: $routes.index },
  { label: 'Add New ' + $labels.singular_name, }
]

const getToday = () => {
  return new Date().toISOString().slice(0, 10);
}

/* =====================================================
   Add Row
===================================================== */
const newRows = ref([
  {
    transaction_date: getToday(),
    payment_type: '',
    party_type: '',
    account_id: '',
    customer_id: '',
    supplier_id: '',
    amount: '',
    cheque_number: '',
    note: '',
  }
])

const addRowField = () =>
  newRows.value.push({
    transaction_date: getToday(),
    payment_type: '',
    party_type: '',
    account_id: '',
    customer_id: '',
    supplier_id: '',
    amount: '',
    cheque_number: '',
    note: '',
  })


/* =====================================================
   Copy Row
===================================================== */
const copyRowField = (index) => {
  const rowToCopy = { ...newRows.value[index] }
  newRows.value.splice(index + 1, 0, rowToCopy)
}

/* =====================================================
   Remove Row
===================================================== */
const removeRowField = (index) => {
  if (newRows.value.length > 1) {
    newRows.value.splice(index, 1)
  }
}

/* =====================================================
   Submit Rows
===================================================== */

const processing = ref<boolean>(false);
const loading = ref(true)

const submitRows = async () => {

  if (processing.value) return; // next time submit disable when current is proccessing

  processing.value = true;

  try {
    await axiosInstance.post('/payment-and-receives', {
      rows: newRows.value
    });

    messageStore.showSuccess('Data has been created successfully!');

    newRows.value = [{
      transaction_date: getToday(),
      payment_type: '',
      party_type: '',
      account_id: '',
      customer_id: '',
      supplier_id: '',
      amount: '',
      cheque_number: '',
      note: '',
    }];

  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'An error occurred while creating rows.');
    } else {
      messageStore.showError('An unexpected error occurred.');
    }
  } finally {
    processing.value = false;
  }
};


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
})

watch(
  () => newRows.value,
  (rows) => {
    rows.forEach((row) => {
      if (row.party_type === 'customer') {
        row.supplier_id = ''
        row.payment_type = 'receive'
      }

      if (row.party_type === 'supplier') {
        row.customer_id = ''
        row.payment_type = 'payment'
      }

      if (!row.party_type) {
        row.customer_id = ''
        row.supplier_id = ''
        row.payment_type = ''
      }
    })
  },
  { deep: true }
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

   <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <!-- Title + Total -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">Add New {{ $labels.singular_name }}</h2>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 flex-wrap">
        <router-link :to="$routes.index" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
		        <rect x="3" y="3" width="7" height="7" rx="1" ry="1"/>
		        <rect x="14" y="3" width="7" height="7" rx="1" ry="1"/>
		        <rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>
		        <rect x="14" y="14" width="7" height="7" rx="1" ry="1"/>
		    </svg>
          View All
        </router-link>

        <router-link :to="$routes.trash" class="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer">
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

  <!-- Loading -->
  <div v-if="loading" class="space-y-4">
    <FormSkeleton :columns="3" :rows="4" />
  </div>

   <form v-else @submit.prevent="submitRows" class="space-y-4">

  <div
    v-for="(row, index) in newRows"
    :key="index"
    class="bg-white pb-5 border-b border-gray-200 transition relative space-y-4"
  >

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
    <button
      type="submit"
      :disabled="processing"
      class="w-full bg-gray-500 text-white font-semibold p-3 hover:bg-gray-600 transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ processing ? 'Processing...' : 'Submit All ' + $labels.plural_name }}
    </button>

</form>

  </div>
  
</div>
</template>
