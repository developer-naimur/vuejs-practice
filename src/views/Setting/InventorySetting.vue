<script setup>
import { ref } from 'vue'
import SettingsMenu from '@/components/inc/SubSidebar/SettingsMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Inventory / Product Settings' }
]

const inventorySettings = ref({
  manage_categories: true,
  manage_units: true,
  default_stock_adjustment: 'auto',
  low_stock_alert: true,
  manage_suppliers: true,
  barcode_sku: true,
  allow_negative_stock: false,
  damage_handling: true
})

const submitInventorySettings = () => {
  console.log('Submitted:', inventorySettings.value)
}
</script>

<template>


<div class="flex gap-4">

  <div class="flex-none">
    <SettingsMenu />
  </div>

  <div class="flex-1 ml-[320px] p-4 max-w-4xl mx-auto space-y-8">

    <Breadcrumb :items="breadcrumbs" />
    <h1 class="text-3xl font-semibold text-gray-700 mb-6">Inventory / Product Settings</h1>

    <form @submit.prevent="submitInventorySettings" class="space-y-6">

      <!-- Product Management -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-green-500">📦</span>
          <span>Product Management</span>
        </h2>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Categories & Subcategories</span>
          <input type="checkbox" v-model="inventorySettings.manage_categories" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Units of Measurement</span>
          <input type="checkbox" v-model="inventorySettings.manage_units" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Default Stock Adjustment Rules</span>
          <select v-model="inventorySettings.default_stock_adjustment" class="border rounded p-2">
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Stock Threshold / Low Stock Alerts</span>
          <input type="checkbox" v-model="inventorySettings.low_stock_alert" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Manage Suppliers</span>
          <input type="checkbox" v-model="inventorySettings.manage_suppliers" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Barcode / SKU Settings</span>
          <input type="checkbox" v-model="inventorySettings.barcode_sku" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span>Allow Negative Stock</span>
          <input type="checkbox" v-model="inventorySettings.allow_negative_stock" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2">
          <span>Damage / Waste Handling Settings</span>
          <input type="checkbox" v-model="inventorySettings.damage_handling" class="toggle-checkbox"/>
        </div>

      </div>

      <!-- Submit -->
      <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 shadow-md transition">
        Save Inventory Settings
      </button>

    </form>
  </div>
  
</div>
</template>

<style>
.toggle-checkbox { width: 2rem; height: 1.2rem; accent-color: #3b82f6; }
</style>
