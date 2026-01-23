<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

import FormSkeleton from '@/components/Skeleton/Form-1.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import SettingsMenu from '@/components/inc/SubSidebar/SettingsMenu.vue'
import { useMessageStore } from '@/stores/useMessageStore'

const messageStore = useMessageStore()
const route = useRoute()
const router = useRouter()

const rowId = route.params.id

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Users', to: '/setting/user' },
  { label: 'Edit User' }
]

const processing = ref(false)
const loading = ref(true)

/* ===============================
  SINGLE ROW STATE
================================ */
const row = ref({})

const togglePassword = (row) => {
  row.showPassword = !row.showPassword
}

/* ===============================
  FETCH TAX DATA
================================ */
const fetchRow = async () => {
  try {
    const res = await axiosInstance.get(`/users/${rowId}`)
	const data = res.data.data

    row.value = {
      name: data.name,
      phone: data.phone,
      role: data.role,
      email: data.email,
      password: '',
      status: data.status,
      showPassword: false,
    }
  } catch (err) {
    messageStore.showError('Failed to load row data')
  } finally {
    loading.value = false
  }
}

/* ===============================
  UPDATE TAX
================================ */
const submitUpdate = async () => {
  if (processing.value) return

  processing.value = true

  try {
    await axiosInstance.put(`/users/${rowId}`, row.value)
    messageStore.showSuccess('Row updated successfully!')
    router.push('/setting/user')
  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Update failed')
    } else {
      messageStore.showError('Unexpected error occurred')
    }
  } finally {
    processing.value = false
  }
}

//load roles
const roles = ref([])
const roleLoading = ref<boolean>(false);
const loadRoles = async () => {
  loading.value = true
  roleLoading.value = true
  try {
    const res = await axiosInstance.get('/roles/option/list')
    roles.value = res.data.data
  } catch (err) {
    messageStore.showError('Role load failed. Please check permission.')
  } finally {
    roleLoading.value = false
    loading.value = false
  }
}

onMounted(() => {
  loadRoles()
  fetchRow()
})
</script>

<template>
<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <SettingsMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Title -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold text-gray-700">Edit User</h2>

      <router-link
        to="/setting/user"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        View All
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <FormSkeleton :columns="3" :rows="2" />
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="submitUpdate" class="space-y-4">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input type="text" v-model="row.name" placeholder="Name *" class="border p-3" />

          <input type="text" v-model="row.phone" placeholder="Phone *" class="border p-3" />

          <input type="email" v-model="row.email" placeholder="Email *" class="border p-3" />

          <select
            v-model="row.role"
            class="border p-3"
            :disabled="roleLoading || !roles.length"
            multiple
          >
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.role_name }}
            </option>
          </select>

       </div>

       <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

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
          	<option value="inactive">Inactive</option>
          	<option value="active">Active</option>
          </select>

       </div>

      <button
        type="submit"
        :disabled="processing"
        class="w-full bg-gray-500 text-white font-semibold p-3 rounded
               hover:bg-gray-600 transition cursor-pointer
               disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ processing ? 'Updating...' : 'Update User' }}
      </button>

    </form>

  </div>
</div>
</template>
