<script setup lang="ts">
import { ref } from 'vue'
import FormSkeleton from '@/components/skeleton/Form-1.vue'
import ProductMenu from '@/components/inc/SubSidebar/ProductMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import { $routes, $labels } from '@/constants/category'

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

/* =====================================================
   Add Row
===================================================== */
const newRows = ref([{ name: '', status: '' }])
const addRowField = () => newRows.value.push({ name: '', status: '' })


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
   Sumit Rows
===================================================== */



const processing = ref<boolean>(false);
const submitRows = async () => {

  if (processing.value) return; // next time submit disable when current is proccessing

  processing.value = true;

  try {
    await axiosInstance.post('/product-categories', {
      rows: newRows.value
    });

    messageStore.showSuccess('Data has been created successfully!');

    newRows.value = [{ name: '', status: '' }]; // optional reset

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

</script>

<template>

<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <ProductMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4">

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
    
    <!-- Form -->
    <form @submit.prevent="submitRows" class="space-y-4">

      <div v-for="(row, index) in newRows" :key="index"
           class="flex gap-4 items-end bg-white pb-5 border-b border-gray-200 transition relative">

        <!-- row Name -->
        <div class="flex-1">
          <label class="block text-gray-600 font-medium mb-1 text-sm">
            Name <span class="text-red-600">*</span>
          </label>
          <input v-model="row.name" type="text" placeholder="Enter name *"
                 class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"/>
        </div>

        <!-- Status -->
        <div class="w-40">
          <label class="block text-gray-600 font-medium mb-1 text-sm">
            Status <span class="text-red-600">*</span>
          </label>
          <select v-model="row.status"
                  class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition">
            <option value="">Status *</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="w-36 flex gap-2">

          <!-- Remove row (icon only) -->
          <button type="button" @click="removeRowField(index)"
                  :disabled="newRows.length === 1"
                  class="w-12 h-12 flex items-center justify-center rounded-md
                         bg-red-100 text-red-600 hover:bg-red-600 hover:text-white
                         transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Remove row">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Copy & Add Row (icon only) -->
          <button v-if="index === newRows.length - 1" type="button" @click="copyRowField(index)"
                  class="w-12 h-12 flex items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  title="Copy & Add Row">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2"/>
			        <rect x="8" y="8" width="12" height="12" rx="2" ry="2"/>
			        <path stroke-linecap="round" stroke-linejoin="round" d="M12 12v4m2-2h-4"/>
			    </svg>
          </button>

          <!-- Add row Button (only for last row) -->
          <button v-if="index === newRows.length - 1" type="button" @click="addRowField"
                  class="w-12 h-12 flex items-center justify-center rounded-md bg-green-500 text-white cursor-pointer"
                  title="Add More rows">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
          </button>

        </div>

      </div>

      <!-- Submit -->
      <div>

        <button
          type="submit"
          :disabled="processing"
          class="w-full bg-gray-500 text-white font-semibold p-3 hover:bg-gray-600 transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ processing ? 'Processing...' : 'Submit All ' + $labels.plural_name }}
        </button>
    
      </div>

    </form>
  </div>
  
</div>
</template>
