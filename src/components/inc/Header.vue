<script setup lang="ts">
</script>

<template>
  <div class="fixed top-0 left-0 w-screen flex items-center gap-10 bg-gray-200 p-2 border-b border-gray-200 z-50 overflow-visible" id="__header">
    <!-- <div class="flex-none">
      <img class="w-24" src="/public/logo.png" alt="logo" />
    </div> -->
    <div class="hidden lg:block flex-1 text-center overflow-visible">
      <div class="flex gap-4 items-center justify-end">

        <!-- Sales Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <router-link class="cursor-pointer" to="/sale/home">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/sales.png" alt="sales" />
          </router-link>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Sales</span>
        </div>

        <!-- Purchase Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <router-link class="cursor-pointer" to="/purchase/home">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/purchase.png" alt="purchase" />
          </router-link>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Purchase</span>
        </div>

        <!-- Product Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <router-link class="cursor-pointer" to="/product/home">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/product.png" alt="product" />
          </router-link>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Product</span>
        </div>

        <!-- Stock Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <router-link class="cursor-pointer" to="/stock/home">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/stock.png" alt="stock" />
          </router-link>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Stock</span>
        </div>

      <!-- Contacts Button -->
      <div class="relative group">
        <router-link class="cursor-pointer" to="/contact/home">
          <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/contact.png" alt="contact" />
        </router-link>
        <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Contacts</span>
      </div>

        <!-- Reports Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <router-link class="cursor-pointer" to="/report/home">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/reports.png" alt="reports" />
          </router-link>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Reports</span>
        </div>

        <!-- Accounts Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <router-link class="cursor-pointer" to="/account/home">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/accounts.png" alt="accounts" />
          </router-link>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Accounts</span>
        </div>

        <!-- Settings Button -->
        <div class="relative flex flex-col items-center group overflow-visible">
          <router-link class="cursor-pointer" to="/setting/home">
            <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/settings.png" alt="settings" />
          </router-link>
          <span class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]">Settings</span>
        </div>

      </div>
    </div>


    <div class="block lg:hidden flex-1 text-center overflow-visible">
    </div>
    <div class="flex-none pr-3">
      <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/profile.png" alt="profile" />
    </div>
    
  </div>
</template>

