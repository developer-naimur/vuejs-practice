<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import axiosInstance from '@/axiosInstance';
import { AxiosError } from "axios";
import { useMessageStore } from '@/stores/useMessageStore'

const messageStore = useMessageStore()
const loading = ref(false)
const processing = ref<boolean>(false);
const processing2 = ref<boolean>(false);

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'My Account' }
]

const user = ref({
  name: '',
  email: '',
  phone: '',
  language: 'en',
  theme: 'light'
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

/* ================= LOAD USER ================= */
const fetchUser = async () => {
  loading.value = true
  try {
    const res = await axiosInstance.get('/my-account')
    user.value = res.data.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

/* ================= UPDATE PROFILE ================= */
const updateProfile = async () => {
  if (processing.value) return;
  processing.value = true;
  try {
    await axiosInstance.put('/my-account/update', user.value)
    messageStore.showSuccess('Profile updated successfully')
  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'An error occurred while update acccount.');
    } else {
      messageStore.showError('An unexpected error occurred.');
    }
  } finally {
    processing.value = false;
  }
}

/* ================= UPDATE PASSWORD ================= */
const updatePassword = async () => {
  if (processing2.value) return;
  processing2.value = true;
  try {
    await axiosInstance.put('/my-account/password', passwordForm.value)
    messageStore.showSuccess('Password updated successfully')
    passwordForm.value = {
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'An error occurred while update acccount.');
    } else {
      messageStore.showError('An unexpected error occurred.');
    }
  } finally {
    processing2.value = false;
  }
}

onMounted(fetchUser)

const visibility = reactive({
  current: false,
  new: false,
  confirm: false
})

</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <div class="flex-1 p-6 max-w-5xl mx-auto space-y-10">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb :items="breadcrumbs" class="mb-2" />
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
          <p class="text-gray-500 mt-1">Manage your profile information and security preferences.</p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-500 font-medium">Loading account details...</p>
      </div>

      <div v-else class="space-y-8">
        
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-50 bg-gray-50/50">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Information
            </h2>
          </div>
          
          <div class="p-6 space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600 ml-1">Full Name</label>
                <input v-model="user.name" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none" placeholder="Enter your name" />
              </div>
              
              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600 ml-1">Email Address</label>
                <input v-model="user.email" disabled type="email" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>

              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600 ml-1">Phone Number</label>
                <input v-model="user.phone" type="tel" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none" placeholder="+880 1XXX-XXXXXX" />
              </div>
            </div>

            <hr class="border-gray-100" />

            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600 ml-1">Preferred Language</label>
                <select v-model="user.language" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none bg-no-repeat bg-[right_1rem_center]">
                  <option value="en">🇺🇸 English</option>
                  <option value="bn">🇧🇩 Bangla</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-semibold text-gray-600 ml-1">Display Theme</label>
                <select v-model="user.theme" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none">
                  <option value="light">☀️ Light</option>
                  <option value="dark">🌙 Dark</option>
                  <option value="system">🖥️ System</option>
                </select>
              </div>
            </div>
          </div>

          <div class="p-6 bg-gray-50/50 flex justify-end">
            <button @click="updateProfile" :disabled="processing" 
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2.5 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
              <span v-if="processing" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ processing ? 'Processing...' : 'Save Changes' }}
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-50 bg-gray-50/50">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security & Password
            </h2>
          </div>

          <div class="p-6">
            <div class="grid lg:grid-cols-3 gap-6">
              <div
                v-for="field in [
                  { key: 'current', label: 'Current Password', model: 'current_password' },
                  { key: 'new', label: 'New Password', model: 'new_password' },
                  { key: 'confirm', label: 'Confirm Password', model: 'new_password_confirmation' }
                ]"
                :key="field.key"
                class="space-y-1"
              >
                <label class="text-sm font-semibold text-gray-600 ml-1">
                  {{ field.label }}
                </label>

                <div class="relative">
                  <input
                    :type="visibility[field.key] ? 'text' : 'password'"
                    v-model="passwordForm[field.model]"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none pr-11"
                    autocomplete="new-password"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    @click="visibility[field.key] = !visibility[field.key]"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <!-- Eye -->
                    <svg
                      v-if="!visibility[field.key]"
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>

                    <!-- Eye Off -->
                    <svg
                      v-else
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 bg-gray-50/50 flex justify-end">
            <button @click="updatePassword" :disabled="processing2" 
              class="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-2.5 px-8 rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-95 flex items-center gap-2">
              <span v-if="processing2" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ processing2 ? 'Processing...' : 'Update Password' }}
            </button>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions for inputs */
input, select {
  transition: all 0.2s ease-in-out;
}
</style>