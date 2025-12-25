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
  <!-- Sidebar (fixed) -->
  <div class="fixed top-[0px] left-0 h-screen bg-gray-200 flex flex-col justify-between items-center p-2 border-r border-gray-200 z-100">


      <!-- Logo -->
      <div class="relative group">
        <router-link to="/dashboard" class="cursor-pointer">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/logo.png" alt="logo" />
        </router-link>
      </div>

    <!-- Menu icons vertically centered -->
    <div class="flex-1 flex flex-col justify-center items-center gap-4 overflow-visible">

      <!-- Sales Button -->
      <div class="relative group">
        <button class="cursor-pointer" @click="OpenSubMenu('sales')">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/sales.png" alt="sales" />
        </button>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Sales</span>
      </div>

      <!-- Purchase Button -->
      <div class="relative group">
        <button class="cursor-pointer" @click="OpenSubMenu('purchase')">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/purchase.png" alt="purchase" />
        </button>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Purchase</span>
      </div>

      <!-- Product Button -->
      <div class="relative group">
        <button class="cursor-pointer" @click="OpenSubMenu('product')">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/product.png" alt="product" />
        </button>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Product</span>
      </div>

      <!-- Stock Button -->
      <div class="relative group">
        <button class="cursor-pointer" @click="OpenSubMenu('stock')">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/stock.png" alt="stock" />
        </button>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Stock</span>
      </div>

      <!-- Contacts Button -->
      <div class="relative group">
        <button class="cursor-pointer" @click="OpenSubMenu('contact')">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/contact.png" alt="contact" />
        </button>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Contacts</span>
      </div>

      <!-- Reports Button -->
      <div class="relative group">
        <button class="cursor-pointer" @click="OpenSubMenu('report')">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/reports.png" alt="reports" />
        </button>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Reports</span>
      </div>

      <!-- Accounts Button -->
      <div class="relative group">
        <button class="cursor-pointer" @click="OpenSubMenu('account')">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/accounts.png" alt="accounts" />
        </button>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Accounts</span>
      </div>

      <!-- Settings Button -->
      <div class="relative group">
        <button class="cursor-pointer" @click="OpenSubMenu('setting')">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/settings.png" alt="settings" />
        </button>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Settings</span>
      </div>

    </div>

  </div>
</template>