<script setup>
import { ref } from 'vue'
import SettingsMenu from '@/components/inc/SubSidebar/SettingsMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

/* Breadcrumb */
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'System / Technical Settings' }
]

/* Form Data */
const systemSettings = ref({
  backup_auto: true,
  backup_frequency: 'daily',
  import_export: false,
  show_logs: true,
  pos_printer: true,
  pos_cashdrawer: false,
  pos_barcode: true,
  auto_update: false
})

const submitSystemSettings = () => {
  console.log('Submitted:', systemSettings.value)
}
</script>

<template>

<div class="flex gap-4">

  <div class="flex-none">
    <SettingsMenu />
  </div>

  <div class="flex-1 ml-[320px] p-4 max-w-4xl mx-auto space-y-8">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <h1 class="text-3xl font-semibold text-gray-700 mb-6">System / Technical Settings</h1>

    <form @submit.prevent="submitSystemSettings" class="space-y-8">

      <!-- Backup & Restore -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-green-500">💾</span>
          <span>Backup & Restore</span>
        </h2>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span class="text-gray-700 font-medium">Automatic Backup</span>
          <input type="checkbox" v-model="systemSettings.backup_auto" class="toggle-checkbox"/>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:space-x-4 mt-2">
          <label class="w-full md:w-40 text-gray-600 font-medium">Backup Frequency</label>
          <select v-model="systemSettings.backup_frequency" class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-400 focus:border-green-400">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <!-- Data Import / Export -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-blue-500">📤</span>
          <span>Data Import / Export</span>
        </h2>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span class="text-gray-700 font-medium">Enable Import/Export</span>
          <input type="checkbox" v-model="systemSettings.import_export" class="toggle-checkbox"/>
        </div>
      </div>

      <!-- System Logs -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-yellow-500">📜</span>
          <span>System Logs</span>
        </h2>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span class="text-gray-700 font-medium">Show System Logs</span>
          <input type="checkbox" v-model="systemSettings.show_logs" class="toggle-checkbox"/>
        </div>
      </div>

      <!-- POS Hardware Configuration -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-purple-500">🖨️</span>
          <span>POS Hardware Configuration</span>
        </h2>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span class="text-gray-700 font-medium">Printer Connected</span>
          <input type="checkbox" v-model="systemSettings.pos_printer" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span class="text-gray-700 font-medium">Cash Drawer Connected</span>
          <input type="checkbox" v-model="systemSettings.pos_cashdrawer" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span class="text-gray-700 font-medium">Barcode Scanner Connected</span>
          <input type="checkbox" v-model="systemSettings.pos_barcode" class="toggle-checkbox"/>
        </div>
      </div>

      <!-- Software Update Settings -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-red-500">🔄</span>
          <span>Software Update Settings</span>
        </h2>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span class="text-gray-700 font-medium">Automatic Updates</span>
          <input type="checkbox" v-model="systemSettings.auto_update" class="toggle-checkbox"/>
        </div>
      </div>

      <!-- Submit -->
      <div class="pt-4">
        <button type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 shadow-md transition">
          Save System Settings
        </button>
      </div>

    </form>
  </div>
  
</div>
</template>

<style>
.toggle-checkbox {
  width: 2rem;
  height: 1.2rem;
  accent-color: #3b82f6; /* Tailwind blue-500 */
}
</style>
