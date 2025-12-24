<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Sales / Transaction Settings' }
]

const salesSettings = ref({
  pos_terminal: true,
  payment_cash: true,
  payment_card: true,
  payment_mobile: false,
  discount_rules: true,
  tax_rules: true,
  invoice_prefix: 'INV',
  default_customer: true,
  return_policy: true
})

const submitSalesSettings = () => {
  console.log('Submitted:', salesSettings.value)
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto space-y-8">
    <Breadcrumb :items="breadcrumbs" />
    <h1 class="text-3xl font-semibold text-gray-700 mb-6">Sales / Transaction Settings</h1>

    <form @submit.prevent="submitSalesSettings" class="space-y-6">

      <!-- POS & Payments -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-green-500">💳</span>
          <span>POS & Payments</span>
        </h2>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>POS Terminal Settings</span>
          <input type="checkbox" v-model="salesSettings.pos_terminal" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Payment Methods - Cash</span>
          <input type="checkbox" v-model="salesSettings.payment_cash" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Payment Methods - Card</span>
          <input type="checkbox" v-model="salesSettings.payment_card" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Payment Methods - Mobile Banking</span>
          <input type="checkbox" v-model="salesSettings.payment_mobile" class="toggle-checkbox"/>
        </div>
      </div>

      <!-- Discount & Tax -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-yellow-500">💰</span>
          <span>Discount & Tax Rules</span>
        </h2>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Discount & Promotion Rules</span>
          <input type="checkbox" v-model="salesSettings.discount_rules" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Tax Application Rules (VAT, Sales Tax)</span>
          <input type="checkbox" v-model="salesSettings.tax_rules" class="toggle-checkbox"/>
        </div>
      </div>

      <!-- Invoice & Customer -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-blue-500">🧾</span>
          <span>Invoice & Customer</span>
        </h2>

        <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
          <label class="w-full md:w-44 text-gray-700 font-medium">Invoice Number Prefix</label>
          <input type="text" v-model="salesSettings.invoice_prefix" class="flex-1 border rounded p-2"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Default Customer Settings</span>
          <input type="checkbox" v-model="salesSettings.default_customer" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2">
          <span>Return / Exchange Policy</span>
          <input type="checkbox" v-model="salesSettings.return_policy" class="toggle-checkbox"/>
        </div>
      </div>

      <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 shadow-md transition">
        Save Sales Settings
      </button>
    </form>
  </div>
</template>

<style>
.toggle-checkbox { width: 2rem; height: 1.2rem; accent-color: #3b82f6; }
</style>
