<template>
  <!-- Sidebar (fixed) -->
  <div class="fixed top-[57px] left-0 h-screen bg-gray-100 flex flex-col justify-between items-center p-2 border-r border-gray-200">

    <!-- Menu icons vertically centered -->
    <div class="flex-1 flex flex-col justify-center items-center gap-4 overflow-y-auto">
      <router-link to="">
        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/sales.png" alt="sales" />
      </router-link>
      <router-link to="">
        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/purchase.png" alt="purchase" />
      </router-link>
       <router-link to="">
        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/product.png" alt="product" />
      </router-link>
      <router-link to="">
        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/stock.png" alt="stock" />
      </router-link>
      <router-link to="">
        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/reports.png" alt="reports" />
      </router-link>
      <router-link to="">
        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/accounts.png" alt="accounts" />
      </router-link>
      <router-link to="">
        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/settings.png" alt="settings" />
      </router-link>
    </div>

    <!-- Optional: Profile at bottom -->
    <!--
    <div class="flex-none flex justify-center mt-4">
      <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/profile.png" alt="profile" />
    </div>
    -->
  </div>
</template>
