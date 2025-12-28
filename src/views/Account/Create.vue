<script setup>
import { ref } from 'vue'
import AccountMenu from '@/components/inc/SubSidebar/AccountMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

/* ------------------------
   Breadcrumb
------------------------ */
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Add Opening Account' }
]

/* ------------------------
   Form Items
------------------------ */
const items = ref([
  {
    account_name: '',
    account_number: '',
    opening_amount: '',
    note: ''
  }
])

const addField = () => {
  items.value.push({
    account_name: '',
    account_number: '',
    opening_amount: '',
    note: ''
  })
}

const copyField = (index) => {
  const copied = { ...items.value[index] }
  items.value.splice(index + 1, 0, copied)
}

const removeField = (index) => {
  if (items.value.length > 1) {
    items.value.splice(index, 1)
  }
}

const submitItems = () => {
  console.log('Submitted:', items.value)
}
</script>

<template>
<div class="flex gap-4">

  <div class="flex-none">
    <AccountMenu />
  </div>

  <div class="flex-1 ml-[320px] p-4 space-y-6">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <h2 class="text-2xl font-semibold text-gray-700">
        Add Opening Account
      </h2>

      <div class="flex gap-2 flex-wrap">
        <router-link
          to="/account"
          class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
        >
          <!-- GRID SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          View All
        </router-link>
      </div>
    </div>

    <!-- FORM -->
    <form @submit.prevent="submitItems" class="space-y-4">

      <div
        v-for="(item, index) in items"
        :key="index"
        class="bg-white pb-5 border-b border-gray-200 transition relative space-y-4"
      >

        <!-- Row 1 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

          <!-- Account Name -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Account Name <span class="text-red-600">*</span>
            </label>
            <input
              v-model="item.account_name"
              type="text"
              class="w-full border p-3"
              placeholder="Account Name"
            />
          </div>

          <!-- Account Number -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Account Number
            </label>
            <input
              v-model="item.account_number"
              type="text"
              class="w-full border p-3"
              placeholder="Account Number"
            />
          </div>

          <!-- Opening Amount -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Opening Amount <span class="text-red-600">*</span>
            </label>
            <input
              v-model="item.opening_amount"
              type="number"
              placeholder="0.00"
              class="w-full border p-3"
            />
          </div>

        </div>

        <!-- Row 2 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

          <!-- Note -->
          <div class="md:col-span-2">
            <label class="block text-sm text-gray-600 mb-1">
              Note
            </label>
            <textarea
              v-model="item.note"
              rows="2"
              placeholder="Optional note"
              class="w-full border p-3"
            ></textarea>
          </div>

        </div>

        <!-- ACTION BUTTONS (SVG SAME AS BEFORE) -->
        <div class="w-36 flex gap-2">

          <!-- Remove -->
          <button
            type="button"
            @click="removeField(index)"
            :disabled="items.length === 1"
            class="w-12 h-12 flex items-center justify-center rounded-md
                   bg-red-100 text-red-600 hover:bg-red-600 hover:text-white
                   transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Copy -->
          <button
            v-if="index === items.length - 1"
            type="button"
            @click="copyField(index)"
            class="w-12 h-12 flex items-center justify-center rounded-md
                   bg-blue-500 text-white hover:bg-blue-600"
            title="Copy & Add"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2"/>
              <rect x="8" y="8" width="12" height="12" rx="2"/>
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 12v4m2-2h-4"/>
            </svg>
          </button>

          <!-- Add -->
          <button
            v-if="index === items.length - 1"
            type="button"
            @click="addField"
            class="w-12 h-12 flex items-center justify-center rounded-md
                   bg-green-500 text-white"
            title="Add"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 4v16m8-8H4"/>
            </svg>
          </button>

        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="w-full bg-gray-500 text-white font-semibold p-3 hover:bg-gray-600 transition"
      >
        Submit All
      </button>

    </form>
  </div>
  
</div>
</template>
