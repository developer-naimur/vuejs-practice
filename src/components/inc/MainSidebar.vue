<script setup lang="ts">
  const sidebarIcons = [
    { label: 'Sales', to: '/sale/home', icon: '/public/icons/sales.png' },
    { label: 'Purchase', to: '/purchase/home', icon: '/public/icons/purchase.png' },
    { label: 'Product', to: '/product/home', icon: '/public/icons/product.png' },
    { label: 'Stock', to: '/stock/home', icon: '/public/icons/stock.png' },
    { label: 'Contacts', to: '/contact/home', icon: '/public/icons/contact.png' },
    { label: 'Accounts', to: '/account/home', icon: '/public/icons/accounts.png' },
    { label: 'Reports', to: '/report/home', icon: '/public/icons/reports.png' },
    { label: 'Settings', to: '/setting/home', icon: '/public/icons/settings.png' },
  ]
</script>

<template>
  <!-- Sidebar (fixed) -->
  <div class="hidden lg:flex fixed top-[0px] left-0 h-screen bg-gray-200 flex-col justify-between items-center p-2 border-r border-gray-200 z-100">


      <!-- Logo -->
      <div class="relative group">
        <router-link to="/dashboard" class="cursor-pointer">
          <img class="bg-white border border-gray-300 rounded-lg p-2 w-10 h-10" src="/public/logo.png" alt="logo" />
        </router-link>
      </div>

    <!-- Menu icons vertically centered -->
    <div class="flex-1 flex flex-col justify-center items-center gap-4 overflow-visible">

      <div
        v-for="menu in sidebarIcons"
        :key="menu.to"
        class="relative group"
      >
        <router-link :to="menu.to" class="cursor-pointer">
          <img
            :src="menu.icon"
            :alt="menu.label.toLowerCase()"
            class="bg-white border border-gray-300 rounded-lg p-2 w-10 h-10"
          />
        </router-link>
        <span
          class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]"
        >
          {{ menu.label }}
        </span>
      </div>

    </div>

  </div>
</template>