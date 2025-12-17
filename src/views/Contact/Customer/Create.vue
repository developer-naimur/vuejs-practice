<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Customer', to: '/customer' },
  { label: 'Add New Customer' }
]

const newCustomers = ref([
  {
    name: '',
    status: '',
    phone: '',
    address: '',
    opening_balance: '',
    description: ''
  }
])

const addCustomerField = () =>
  newCustomers.value.push({
    name: '',
    status: '',
    phone: '',
    address: '',
    opening_balance: '',
    description: ''
  })

const copyCustomerField = (index) => {
  const customerToCopy = { ...newCustomers.value[index] }
  newCustomers.value.splice(index + 1, 0, customerToCopy)
}

// Remove row only if more than 1 row exists
const removeCustomerField = (index) => {
  if (newCustomers.value.length > 1) {
    newCustomers.value.splice(index, 1)
  }
}

const submitCustomers = () => console.log('Submitted customers:', newCustomers.value)
</script>

<template>
  <div class="p-6 space-y-6">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

   <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <!-- Title + Total -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">Add New Customer</h2>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 flex-wrap">
        <router-link to="/customer" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
		        <rect x="3" y="3" width="7" height="7" rx="1" ry="1"/>
		        <rect x="14" y="3" width="7" height="7" rx="1" ry="1"/>
		        <rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>
		        <rect x="14" y="14" width="7" height="7" rx="1" ry="1"/>
		    </svg>
          View All
        </router-link>

        <router-link to="/customer/trashed" class="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
                     01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0
                     011-1h4a1 1 0 011 1v2" />
          </svg>
          Trash
        </router-link>

        <label class="flex items-center gap-2 px-4 py-2 rounded bg-yellow-400 text-white hover:bg-yellow-500 transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4 16v4h16v-4M12 12v8m0 0l-4-4m4 4l4-4M12 4v8" />
          </svg>
          Import
          <input type="file" class="hidden" accept=".csv" />
        </label>
      </div>
    </div>

   
   <form @submit.prevent="submitCustomers" class="space-y-4">

  <div
    v-for="(customer, index) in newCustomers"
    :key="index"
    class="bg-white pb-5 border-b border-gray-200 transition relative space-y-4"
  >

    <!-- Row 1 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Customer Name <span class="text-red-600">*</span>
        </label>
        <input
          v-model="customer.name"
          type="text"
          placeholder="Customer name"
          class="w-full border p-3 focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">
          Phone
        </label>
        <input
          v-model="customer.phone"
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
          v-model="customer.opening_balance"
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
          v-model="customer.status"
          class="w-full border p-3"
        >
          <option value="">Select</option>
          <option>Active</option>
          <option>Inactive</option>
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
          v-model="customer.address"
          type="text"
          placeholder="Customer address"
          class="w-full border p-3"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm text-gray-600 mb-1">
          Description
        </label>
        <textarea
          v-model="customer.description"
          rows="2"
          placeholder="Optional notes"
          class="w-full border p-3"
        ></textarea>
      </div>
    </div>

    <!-- ACTION BUTTONS (SAME STYLE AS PRODUCT FORM) -->
    <div class="w-36 flex gap-2">

      <!-- Remove -->
      <button
        type="button"
        @click="removeCustomerField(index)"
        :disabled="newCustomers.length === 1"
        class="w-12 h-12 flex items-center justify-center rounded-md
               bg-red-100 text-red-600 hover:bg-red-600 hover:text-white
               transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        title="Remove sustomer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Copy -->
      <button
        v-if="index === newCustomers.length - 1"
        type="button"
        @click="copyCustomerField(index)"
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
        v-if="index === newCustomers.length - 1"
        type="button"
        @click="addCustomerField"
        class="w-12 h-12 flex items-center justify-center rounded-md
               bg-green-500 text-white cursor-pointer"
        title="Add Customer"
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
    class="w-full bg-gray-500 text-white font-semibold p-3 hover:bg-gray-600 transition"
  >
    Submit All Customers
  </button>

</form>

  </div>
</template>
