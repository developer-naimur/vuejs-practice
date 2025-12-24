<script setup lang="ts">

import { defineEmits } from 'vue'
const emit = defineEmits<{
  (e: 'menu-selected', menu: string): void
}>()

const OpenSubMenu = (menu: string) => {
  // emit the menu type to parent
  emit('menu-selected', menu)
}

</script>

<template>
  <div class="fixed top-0 left-0 w-screen flex items-center gap-10 bg-gray-200 p-2 border-b border-gray-200 z-50 overflow-visible" id="__header">
    <!-- <div class="flex-none">
      <img class="w-24" src="/public/logo.png" alt="logo" />
    </div> -->
    <div class="flex-1 text-center overflow-visible">
      <div class="flex gap-4 items-center justify-end">

        <!-- Sales Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <button class="cursor-pointer" @click="OpenSubMenu('sales')">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/sales.png" alt="sales" />
          </button>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Sales</span>
        </div>

        <!-- Purchase Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <button class="cursor-pointer" @click="OpenSubMenu('purchase')">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/purchase.png" alt="purchase" />
          </button>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Purchase</span>
        </div>

        <!-- Product Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <button class="cursor-pointer" @click="OpenSubMenu('product')">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/product.png" alt="product" />
          </button>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Product</span>
        </div>

        <!-- Stock Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <button class="cursor-pointer" @click="OpenSubMenu('stock')">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/stock.png" alt="stock" />
          </button>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Stock</span>
        </div>

      <!-- Contacts Button -->
      <div class="relative group">
        <button class="cursor-pointer" @click="OpenSubMenu('contact')">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/contact.png" alt="contact" />
        </button>
        <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Contacts</span>
      </div>

        <!-- Reports Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <button class="cursor-pointer" @click="OpenSubMenu('report')">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/reports.png" alt="reports" />
          </button>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Reports</span>
        </div>

        <!-- Accounts Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <button class="cursor-pointer" @click="OpenSubMenu('account')">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/accounts.png" alt="accounts" />
          </button>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Accounts</span>
        </div>

        <!-- Settings Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <button class="cursor-pointer" @click="OpenSubMenu('setting')">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/settings.png" alt="settings" />
          </button>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Settings</span>
        </div>

      </div>
    </div>

    <div class="flex-none pr-3">
      <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/profile.png" alt="profile" />
    </div>
  </div>
</template>

