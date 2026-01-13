<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from '@/stores/useUserStore'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const userStore = useUserStore()
const router = useRouter();
const route = useRoute();

const email = ref<string>('');
const password = ref<string>('');
const loading = ref<boolean>(false);
const errorMessage = ref<string>('');
const showPassword = ref<boolean>(false); // <-- password show/hide

const submitForm = async () => {
  errorMessage.value = '';

  try {
    const url = `${apiBaseUrl}/login`;

    const response = await axios.post(url, {
      email: email.value,
      password: password.value,
    });

    if (response.data.token) {
      userStore.setUser(response.data.user, response.data.token)
    }
    router.push(`/dashboard`); 
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || "Invalid credentials. Please try again.";
  }
}

</script>

<template>
  <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>

    <form @submit.prevent="submitForm" class="space-y-4">

      <div
        v-if="errorMessage"
        class="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        <svg
          class="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01M12 3c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z"
          />
        </svg>

        <span v-html="errorMessage"></span>
      </div>

      <div>
        <label class="block mb-1 font-medium" for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email"
               class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      <div class="relative">
        <label class="block mb-1 font-medium" for="password">Password</label>

        <input 
          :type="showPassword ? 'text' : 'password'" 
          id="password" 
          v-model="password" 
          placeholder="Enter your password"
          class="w-full border border-gray-300 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >

        <!-- Show/hide icon -->
        <span 
          @click="showPassword = !showPassword"
          class="absolute top-[50px] right-2 -translate-y-1/2 cursor-pointer text-gray-500"
        >
          <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 012.31-4.062M9.88 9.88a3 3 0 104.24 4.24M15 12a3 3 0 00-3-3m0 0l-3 3m3-3l3 3" />
          </svg>
        </span>
      </div>


      <button type="submit"
              class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
        Login
      </button>

    </form>

    <p class="mt-4 text-center text-gray-600">
      Don't have an account?
      <router-link to="/register" class="text-blue-600 hover:underline">Register</router-link>
    </p>
  </div>
</template>
