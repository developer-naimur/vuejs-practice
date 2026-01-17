<script setup lang="ts">
import { ref } from 'vue'
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


const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'User', to: '/setting/user' },
  { label: 'Add New User' }
]

const togglePassword = (row) => {
  row.showPassword = !row.showPassword
}

const newRows = ref([{ name: '', phone: '', role: '', email: '', username: '', password: '', status: '', showPassword: false }])

const addField = () => newRows.value.push({ name: '', phone: '', role: '', email: '', username: '', password: '', status: '', showPassword: false, })

// Copy the clicked row and insert as new
const copyField = (index) => {
  const rowToCopy = { ...newRows.value[index] }
  newRows.value.splice(index + 1, 0, rowToCopy)
}

// Remove row only if more than 1 row exists
const removeField = (index) => {
  if (newRows.value.length > 1) {
    newRows.value.splice(index, 1)
  }
}
const processing = ref<boolean>(false);
const submitRows = async () => {

  if (processing.value) return; // next time submit disable when current is proccessing

  processing.value = true;

  try {
    await axiosInstance.post('/users', {
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
    <SettingsMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

   <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <!-- Title + Total -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">Add New User</h2>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 flex-wrap">
        <router-link to="/setting/user" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
		        <rect x="3" y="3" width="7" height="7" rx="1" ry="1"/>
		        <rect x="14" y="3" width="7" height="7" rx="1" ry="1"/>
		        <rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>
		        <rect x="14" y="14" width="7" height="7" rx="1" ry="1"/>
		    </svg>
          View All
        </router-link>

        <router-link to="/setting/user/trashed" class="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer">
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
           class="bg-white pb-5 border-b border-gray-200 transition relative space-y-4">

       <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" v-model="row.name" placeholder="Name *" class="border p-3" />
          <input type="text" v-model="row.phone" placeholder="Phone *" class="border p-3" />
          <input type="email" v-model="row.email" placeholder="Email *" class="border p-3" />
          <select v-model="row.role" class="border p-3">
          	<option value="">Role *</option>
          	<option value="0">Admin</option>
          	<option value="1">Manager</option>
          </select>
       </div>

       <div class="grid grid-cols-1 md:grid-cols-4 gap-4">


          <input type="text" v-model="row.username" placeholder="Username *" class="border p-3" />

          <div class="relative">
		  <input
		    :type="row.showPassword ? 'text' : 'password'"
		    v-model="row.password"
		    placeholder="Password *"
		    class="border p-3 w-full pr-10"
		  />

		  <!-- Eye Icon -->
		  <span
		    @click="togglePassword(row)"
		    class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
		  >
		    <!-- Show -->
		    <svg v-if="!row.showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
		         fill="none" viewBox="0 0 24 24" stroke="currentColor">
		      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
		            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
		      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
		            d="M2.458 12C3.732 7.943 7.523 5 12 5
		               c4.477 0 8.268 2.943 9.542 7
		               -1.274 4.057-5.065 7-9.542 7
		               -4.477 0-8.268-2.943-9.542-7z"/>
		    </svg>

		    <!-- Hide -->
		    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
		         fill="none" viewBox="0 0 24 24" stroke="currentColor">
		      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
		            d="M13.875 18.825A10.05 10.05 0 0112 19
		               c-4.478 0-8.268-2.943-9.543-7
		               a9.97 9.97 0 012.042-3.368M6.223 6.223
		               A9.97 9.97 0 0112 5c4.478 0 8.268 2.943 9.543 7
		               a9.978 9.978 0 01-4.132 5.411M15 12a3 3 0 00-3-3"/>
		      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
		            d="M3 3l18 18"/>
		    </svg>
		  </span>
		</div>

          <select v-model="row.status" class="border p-3">
          	<option value="">Status *</option>
          	<option value="0">Inactive</option>
          	<option value="1">Active</option>
          </select>

       </div>

        <!-- Actions -->
        <div class="w-36 flex gap-2">

          <!-- Remove row (icon only) -->
          <button type="button" @click="removeField(index)"
                  :disabled="newRows.length === 1"
                  class="w-12 h-12 flex items-center justify-center rounded-md
                         bg-red-100 text-red-600 hover:bg-red-600 hover:text-white
                         transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Remove Row">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Copy & Add Row (icon only) -->
          <button v-if="index === newRows.length - 1" type="button" @click="copyField(index)"
                  class="w-12 h-12 flex items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  title="Copy & Add Row">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2"/>
			        <rect x="8" y="8" width="12" height="12" rx="2" ry="2"/>
			        <path stroke-linecap="round" stroke-linejoin="round" d="M12 12v4m2-2h-4"/>
			    </svg>
          </button>

          <!-- Add row Button (only for last row) -->
          <button v-if="index === newRows.length - 1" type="button" @click="addField"
                  class="w-12 h-12 flex items-center justify-center rounded-md bg-green-500 text-white cursor-pointer"
                  title="Add More Rows">
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
          {{ processing ? 'Processing...' : 'Submit All Users' }}
        </button>

      </div>

    </form>
  </div>

</div>
</template>
