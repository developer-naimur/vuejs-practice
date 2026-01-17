<script setup lang="ts">
import { ref } from 'vue'
import Preloader from '@/components/skeleton/Preloader-1.vue'
import FormSkeleton from '@/components/skeleton/Form-1.vue'
import SettingsMenu from '@/components/inc/SubSidebar/SettingsMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

import { useMessageStore } from '@/stores/useMessageStore'
const messageStore = useMessageStore()

import { useRouter } from 'vue-router';
import axiosInstance from '@/axiosInstance';
import { AxiosError } from "axios";

import { useUserStore } from "@/stores/useUserStore";
const userStore = useUserStore();
const router = useRouter();

/* Breadcrumb */
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Notifications / Alerts' }
]

/* Form Data */
const notifications = ref({
  low_stock: true,
  expiry: true,
  sales_report: false,
  system_email: true,
  system_sms: false
})

const submitNotifications = () => {
  console.log('Submitted:', notifications.value)
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

    <h1 class="text-3xl font-semibold text-gray-700 mb-6">Notifications / Alerts</h1>

    <form @submit.prevent="submitNotifications" class="space-y-0 relative">
    
     <Preloader />

      <!-- Alerts Section -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-red-500">⚠️</span>
          <span>Alerts</span>
        </h2>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span class="text-gray-700 font-medium">Low Stock Alerts</span>
          <input type="checkbox" v-model="notifications.low_stock" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span class="text-gray-700 font-medium">Expiry Alerts</span>
          <input type="checkbox" v-model="notifications.expiry" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span class="text-gray-700 font-medium">Sales Reports Alerts</span>
          <input type="checkbox" v-model="notifications.sales_report" class="toggle-checkbox"/>
        </div>
      </div>

      <!-- System Notifications -->
      <div class="space-y-4 p-4 rounded-md border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
          <span class="text-blue-500">📩</span>
          <span>System Notifications</span>
        </h2>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span class="text-gray-700 font-medium">Email Notifications</span>
          <input type="checkbox" v-model="notifications.system_email" class="toggle-checkbox"/>
        </div>

        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <span class="text-gray-700 font-medium">SMS Notifications</span>
          <input type="checkbox" v-model="notifications.system_sms" class="toggle-checkbox"/>
        </div>
      </div>

      <!-- Submit -->
      <div class="pt-4">
        <button type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 shadow-md transition">
          Save Notifications
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
