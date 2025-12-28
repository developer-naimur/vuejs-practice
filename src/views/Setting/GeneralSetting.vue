<script setup>
import { ref } from 'vue'
import SettingsMenu from '@/components/inc/SubSidebar/SettingsMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

/* Breadcrumb */
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'General Settings' }
]

/* Form Data */
const settings = ref({
  company_name: '',
  company_address: '',
  company_logo: null,
  tax_id: '',
  currency: 'BDT',
  language: 'en',
  date_format: 'd/m/Y',
  time_format: '12',
  price_decimal: 2,
  qty_decimal: 2,
  invoice_template: 'template1',
  default_tax: 15
})

const submitSettings = () => {
  console.log('Submitted:', settings.value)
}
</script>

<template>


<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <SettingsMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 max-w-4xl mx-auto space-y-8">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <h1 class="text-3xl font-semibold text-gray-700 mb-6">General Settings</h1>

    <form @submit.prevent="submitSettings" class="space-y-8">

      <!-- Company Information -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-blue-500">🏢</span>
          <span>Company Information</span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label class="w-full md:w-40 text-gray-600 font-medium">Company Name <span class="text-red-600">*</span></label>
            <input v-model="settings.company_name" type="text" placeholder="Company Name"
              class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"/>
          </div>

          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label class="w-full md:w-40 text-gray-600 font-medium">Company Address</label>
            <input v-model="settings.company_address" type="text" placeholder="Company Address"
              class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"/>
          </div>

          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label class="w-full md:w-40 text-gray-600 font-medium">Tax ID</label>
            <input v-model="settings.tax_id" type="text" placeholder="Tax ID"
              class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"/>
          </div>

          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label class="w-full md:w-40 text-gray-600 font-medium">Company Logo</label>
            <input type="file" @change="e => settings.company_logo = e.target.files[0]"
              class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"/>
          </div>
        </div>
      </div>

      <!-- Currency & Language -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-green-500">💱</span>
          <span>Currency & Language</span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label class="w-full md:w-40 text-gray-600 font-medium">Currency</label>
            <select v-model="settings.currency"
              class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-400 focus:border-green-400">
              <option value="BDT">BDT</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label class="w-full md:w-40 text-gray-600 font-medium">Language</label>
            <select v-model="settings.language"
              class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-400 focus:border-green-400">
              <option value="en">English</option>
              <option value="bn">Bangla</option>
            </select>
          </div>

          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label class="w-full md:w-40 text-gray-600 font-medium">Date Format</label>
            <select v-model="settings.date_format"
              class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-400 focus:border-green-400">
              <option value="d/m/Y">DD/MM/YYYY</option>
              <option value="m/d/Y">MM/DD/YYYY</option>
              <option value="Y-m-d">YYYY-MM-DD</option>
            </select>
          </div>

          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label class="w-full md:w-40 text-gray-600 font-medium">Time Format</label>
            <select v-model="settings.time_format"
              class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-400 focus:border-green-400">
              <option value="12">12 Hour</option>
              <option value="24">24 Hour</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Price, Quantity & Invoice -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-yellow-500">🧾</span>
          <span>Price, Quantity & Invoice</span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label class="w-full md:w-40 text-gray-600 font-medium">Price Decimal</label>
            <input v-model="settings.price_decimal" type="number" min="0" max="4"
              class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"/>
          </div>

          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label class="w-full md:w-40 text-gray-600 font-medium">Quantity Decimal</label>
            <input v-model="settings.qty_decimal" type="number" min="0" max="4"
              class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"/>
          </div>

          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label class="w-full md:w-40 text-gray-600 font-medium">Invoice Template</label>
            <select v-model="settings.invoice_template"
              class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400">
              <option value="template1">Template 1</option>
              <option value="template2">Template 2</option>
              <option value="template3">Template 3</option>
            </select>
          </div>

          <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
            <label class="w-full md:w-40 text-gray-600 font-medium">Default Tax Rate (%)</label>
            <input v-model="settings.default_tax" type="number" min="0" max="100"
              class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"/>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="pt-4">
        <button type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 shadow-md transition">
          Save Settings
        </button>
      </div>

    </form>
  </div>
  
</div>
</template>
