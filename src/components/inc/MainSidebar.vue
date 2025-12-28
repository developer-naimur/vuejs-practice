<script setup lang="ts">
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
        <router-link class="cursor-pointer" to="/sale/home">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/sales.png" alt="sales" />
        </router-link>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Sales</span>
      </div>

      <!-- Purchase Button -->
      <div class="relative group">
        <router-link class="cursor-pointer" to="/purchase/home">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/purchase.png" alt="purchase" />
        </router-link>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Purchase</span>
      </div>

      <!-- Product Button -->
      <div class="relative group">
        <router-link class="cursor-pointer" to="/product/home">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/product.png" alt="product" />
        </router-link>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Product</span>
      </div>

      <!-- Stock Button -->
      <div class="relative group">
        <router-link class="cursor-pointer" to="/stock/home">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/stock.png" alt="stock" />
        </router-link>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Stock</span>
      </div>

      <!-- Contacts Button -->
      <div class="relative group">
        <router-link class="cursor-pointer" to="/contact/home">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/contact.png" alt="contact" />
        </router-link>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Contacts</span>
      </div>

      <!-- Reports Button -->
      <div class="relative group">
        <router-link class="cursor-pointer" to="/report/home">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/reports.png" alt="reports" />
        </router-link>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Reports</span>
      </div>

      <!-- Accounts Button -->
      <div class="relative group">
        <router-link class="cursor-pointer" to="/account/home">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/accounts.png" alt="accounts" />
        </router-link>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Accounts</span>
      </div>

      <!-- Settings Button -->
      <div class="relative group">
        <router-link class="cursor-pointer" to="/setting/home">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/settings.png" alt="settings" />
        </router-link>
        <span class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Settings</span>
      </div>

    </div>

  </div>
</template>