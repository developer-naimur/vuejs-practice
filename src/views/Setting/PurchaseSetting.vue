<script setup>
import { ref } from 'vue'
import SettingsMenu from '@/components/inc/SubSidebar/SettingsMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Purchase / Supplier Settings' }
]

const purchaseSettings = ref({
  supplier_management: true,
  purchase_order_settings: true,
  default_supplier_terms: '30_days',
  receive_stock_rules: true
})

const submitPurchaseSettings = () => {
  console.log('Submitted:', purchaseSettings.value)
}
</script>

<template>

<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <SettingsMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 max-w-4xl mx-auto space-y-8">

    <Breadcrumb :items="breadcrumbs" />
    <h1 class="text-3xl font-semibold text-gray-700 mb-6">Purchase / Supplier Settings</h1>

    <form @submit.prevent="submitPurchaseSettings" class="space-y-6">

      <!-- Supplier Management -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-green-500">🏢</span>
          <span>Supplier Management</span>
        </h2>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Manage Suppliers</span>
          <input type="checkbox" v-model="purchaseSettings.supplier_management" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Purchase Order Settings</span>
          <input type="checkbox" v-model="purchaseSettings.purchase_order_settings" class="toggle-checkbox"/>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:space-x-4 p-2 border-b border-gray-100">
          <label class="w-full md:w-44 text-gray-700 font-medium">Default Supplier Terms</label>
          <select v-model="purchaseSettings.default_supplier_terms" class="flex-1 border rounded p-2">
            <option value="30_days">30 Days</option>
            <option value="60_days">60 Days</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div class="flex items-center justify-between p-2">
          <span>Receive Stock Rules</span>
          <input type="checkbox" v-model="purchaseSettings.receive_stock_rules" class="toggle-checkbox"/>
        </div>
      </div>

      <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 shadow-md transition">
        Save Purchase Settings
      </button>
    </form>
  </div>
  
</div>
</template>

<style>
.toggle-checkbox { width: 2rem; height: 1.2rem; accent-color: #3b82f6; }
</style>
