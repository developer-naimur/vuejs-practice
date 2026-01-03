<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'My Account' }
]

/* Logged in user data (API theke আসবে) */
const user = ref({
  name: 'Naim Islam',
  email: 'naim@email.com',
  phone: '',
  avatar: null,
  language: 'en',
  theme: 'light'
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const deleteConfirm = ref(false)

const updateProfile = () => {
  console.log('Profile:', user.value)
}

const updatePassword = () => {
  console.log('Password:', passwordForm.value)
}

const deleteAccount = () => {
  if (!deleteConfirm.value) return
  console.log('Account deleted')
}
</script>
<template>
<div class="flex">
  <div class="flex-1 lg:ml-[320px] p-4 max-w-3xl mx-auto space-y-8">

    <Breadcrumb :items="breadcrumbs" />

    <h1 class="text-3xl font-semibold text-gray-700">
      My Account
    </h1>

    <!-- ================= PROFILE ================= -->
    <section class="p-4 border border-gray-200 rounded-lg space-y-4 bg-white">
      <h2 class="text-lg font-semibold text-gray-700">
        👤 Profile Information
      </h2>

      <div class="grid md:grid-cols-2 gap-4">
        <input
          v-model="user.name"
          placeholder="Full Name"
          class="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />

        <input
          v-model="user.email"
          disabled
          class="border rounded p-2 w-full bg-gray-100 text-gray-500"
        />

        <input
          v-model="user.phone"
          placeholder="Phone Number"
          class="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />

        <input
          type="file"
          @change="e => user.avatar = e.target.files[0]"
          class="border rounded p-2 w-full"
        />
      </div>

      <button
        @click="updateProfile"
        class="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        Update Profile
      </button>
    </section>

    <!-- ================= PREFERENCES ================= -->
    <section class="p-4 border border-gray-200 rounded-lg space-y-4 bg-white">
      <h2 class="text-lg font-semibold text-gray-700">
        ⚙️ Preferences
      </h2>

      <div class="grid md:grid-cols-2 gap-4">
        <select
          v-model="user.language"
          class="border rounded p-2 w-full focus:ring-2 focus:ring-green-400 focus:border-green-400"
        >
          <option value="en">English</option>
          <option value="bn">Bangla</option>
        </select>

        <select
          v-model="user.theme"
          class="border rounded p-2 w-full focus:ring-2 focus:ring-green-400 focus:border-green-400"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
    </section>

    <!-- ================= PASSWORD ================= -->
    <section class="p-4 border border-gray-200 rounded-lg space-y-4 bg-white">
      <h2 class="text-lg font-semibold text-gray-700">
        🔐 Change Password
      </h2>

      <div class="grid md:grid-cols-3 gap-4">
        <input
          type="password"
          v-model="passwordForm.current_password"
          placeholder="Current Password"
          class="border rounded p-2 w-full focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        />

        <input
          type="password"
          v-model="passwordForm.new_password"
          placeholder="New Password"
          class="border rounded p-2 w-full focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        />

        <input
          type="password"
          v-model="passwordForm.confirm_password"
          placeholder="Confirm Password"
          class="border rounded p-2 w-full focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        />
      </div>

      <button
        @click="updatePassword"
        class="mt-4 bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800 transition"
      >
        Update Password
      </button>
    </section>

    <!-- ================= DANGER ZONE ================= -->
    <section class="p-4 border border-red-300 rounded-lg space-y-4 bg-red-50">
      <h2 class="text-red-600 font-semibold">
        ⚠️ Danger Zone
      </h2>

      <label class="flex items-center gap-2 text-sm text-red-700">
        <input type="checkbox" v-model="deleteConfirm" />
        I understand this action is permanent
      </label>

      <button
        @click="deleteAccount"
        :disabled="!deleteConfirm"
        class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition"
      >
        Delete Account
      </button>
    </section>

  </div>
</div>
</template>
