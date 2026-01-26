<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Preloader from '@/components/skeleton/Preloader-1.vue'
import FormSkeleton from '@/components/skeleton/Form-2.vue'
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
  { label: 'General Settings' }
]

/* Form Data */
const settings = ref({
  company_name: '',
  company_address: '',
  company_logo: null,
  company_favicon: null,
  tax_id: '',
  language: 'en',
  date_format: 'd/m/Y',
  time_format: '12',
  price_decimal: 2,
  qty_decimal: 2,
  invoice_template: 'template1',
})

/* Preview URLs */
const previews = ref({
  company_logo_url: '',
  company_favicon_url: ''
})

const processing = ref<boolean>(false);
const loading = ref<boolean>(false);


/* Fetch settings from backend */
const fetchSettings = async () => {
  loading.value = true;
  try {
    const res = await axiosInstance.get('/company-settings');
    const data = res.data.data;

    // fill normal fields
    Object.keys(settings.value).forEach((key) => {
      if (data[key] !== undefined && key !== 'company_logo' && key !== 'company_favicon') {
        settings.value[key] = data[key];
      }
    });

    // set preview URLs
    previews.value.company_logo_url = data.company_logo_url || '';
    previews.value.company_favicon_url = data.company_favicon_url || '';

  } catch (err) {
    messageStore.showError('Failed to load settings');
  } finally {
    loading.value = false;
  }
};


const onImageChange = (
  e: Event,
  field: 'company_logo' | 'company_favicon'
) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
  const maxSizeKB = 100;
  const maxSizeBytes = maxSizeKB * 1024;

  if (!allowedTypes.includes(file.type)) {
    messageStore.showError('Only PNG, JPG and WEBP images are allowed.');
    input.value = '';
    return;
  }

  if (file.size > maxSizeBytes) {
    messageStore.showError('Image size must be within 100KB.');
    input.value = '';
    return;
  }

  // update preview
  const reader = new FileReader();
  reader.onload = () => {
    if (field === 'company_logo') previews.value.company_logo_url = reader.result as string;
    if (field === 'company_favicon') previews.value.company_favicon_url = reader.result as string;
  };
  reader.readAsDataURL(file);

  settings.value[field] = file;
};


const submitSettings = async () => {
  if (processing.value) return;
  processing.value = true;

  try {
    const formData = new FormData();

    Object.entries(settings.value).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;
      formData.append(key, value as any);
    });

    await axiosInstance.post('/company-settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    messageStore.showSuccess('Settings saved successfully!');
  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Something went wrong');
    } else {
      messageStore.showError('Unexpected error occurred');
    }
  } finally {
    processing.value = false;
  }
};


onMounted(() => {
  fetchSettings();
});
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

    <div v-if="loading" class="space-y-4">
      <FormSkeleton :columns="3" :rows="4" />
    </div>


      <form v-else @submit.prevent="submitSettings" class="space-y-0 relative">

        <!-- Company Information -->
        <div class="space-y-4 p-4 rounded-md border border-gray-200">
          <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h3v-4h6v4h3a1 1 0 001-1V4a1 1 0 00-1-1H4z" />
            </svg>
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
              <textarea v-model="settings.company_address" type="text" placeholder="Company Address"
                class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"></textarea>
            </div>

            <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
              <label class="w-full md:w-40 text-gray-600 font-medium">Tax ID</label>
              <input v-model="settings.tax_id" type="text" placeholder="Tax ID"
                class="flex-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"/>
            </div>

            <!-- NEW: Logo + Icon in one row -->
            <div class="md:col-span-2">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <!-- Company Logo -->
                <div class="border border-gray-200 rounded p-4">
                  <label class="text-gray-600 font-medium">Company Logo</label>

                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    @change="e => onImageChange(e, 'company_logo')"
                    class="w-full border border-gray-300 rounded p-2 mt-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />

                  <div v-if="previews.company_logo_url" class="mt-3 flex items-center gap-3">
                    <div class="w-24 h-24 rounded border border-gray-300 overflow-hidden flex items-center justify-center">
                      <img :src="previews.company_logo_url" class="max-w-full max-h-full" alt="Company Logo" />
                    </div>
                    <span class="text-sm text-gray-500">Preview</span>
                  </div>
                </div>

                <!-- Company Icon -->
                <div class="border border-gray-200 rounded p-4">
                  <label class="text-gray-600 font-medium">Company Icon Logo</label>

                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    @change="e => onImageChange(e, 'company_favicon')"
                    class="w-full border border-gray-300 rounded p-2 mt-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />

                  <div v-if="previews.company_favicon_url" class="mt-3 flex items-center gap-3">
                    <div class="w-16 h-16 rounded border border-gray-300 overflow-hidden flex items-center justify-center">
                      <img :src="previews.company_favicon_url" class="max-w-full max-h-full" alt="Favicon" />
                    </div>
                    <span class="text-sm text-gray-500">Preview</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <!-- Time & Language -->
        <div class="space-y-4 p-4 rounded-md border border-gray-200">
          <h2 class="text-lg font-semibold text-gray-600 mb-3 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v5.268l3.447 1.723a1 1 0 10.894-1.788L11 9.732V5z" clip-rule="evenodd" />
            </svg>
            <span>Time & Language</span>
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v12a1 1 0 001 1h12a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
              <path d="M6 7h8v2H6V7zm0 4h8v2H6v-2z" />
            </svg>
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

          </div>
        </div>

        <!-- Submit -->
        <div class="pt-4">
          <button
            type="submit"
            :disabled="processing"
            class="w-full bg-gray-500 text-white font-semibold p-3 hover:bg-gray-600 transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ processing ? 'Processing...' : 'Save Settings' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>
