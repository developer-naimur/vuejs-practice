<script setup>
import { ref } from 'vue'
import SettingsMenu from '@/components/inc/SubSidebar/SettingsMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Accounting / Financial Settings' }
]

const accountingSettings = ref({
  opening_closing_balance: true,
  account_types_ledgers: true,
  payment_terms: '30_days',
  tax_rates_rules: true,
  cash_bank_management: true
})

const submitAccountingSettings = () => {
  console.log('Submitted:', accountingSettings.value)
}
</script>

<template>

<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <SettingsMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 max-w-4xl mx-auto space-y-8">

    <Breadcrumb :items="breadcrumbs" />
    <h1 class="text-3xl font-semibold text-gray-700 mb-6">Accounting / Financial Settings</h1>

    <form @submit.prevent="submitAccountingSettings" class="space-y-6">

      <!-- Financial Management -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-green-500">💼</span>
          <span>Financial Management</span>
        </h2>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Opening & Closing Balance</span>
          <input type="checkbox" v-model="accountingSettings.opening_closing_balance" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Account Types & Ledgers</span>
          <input type="checkbox" v-model="accountingSettings.account_types_ledgers" class="toggle-checkbox"/>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:space-x-4 p-2 border-b border-gray-100">
          <label class="w-full md:w-44 text-gray-700 font-medium">Payment Terms</label>
          <select v-model="accountingSettings.payment_terms" class="flex-1 border rounded p-2">
            <option value="30_days">30 Days</option>
            <option value="60_days">60 Days</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Tax Rates & Rules</span>
          <input type="checkbox" v-model="accountingSettings.tax_rates_rules" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2">
          <span>Cash / Bank Management</span>
          <input type="checkbox" v-model="accountingSettings.cash_bank_management" class="toggle-checkbox"/>
        </div>

      </div>

      <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 shadow-md transition">
        Save Accounting Settings
      </button>
    </form>
  </div>

</div>
</template>

<style>
.toggle-checkbox { width: 2rem; height: 1.2rem; accent-color: #3b82f6; }
</style>
