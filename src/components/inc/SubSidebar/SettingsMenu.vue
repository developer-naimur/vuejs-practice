<script setup lang="ts">
import { onMounted } from 'vue'
</script>

<template>
  <!-- Sidebar (fixed) -->
  <div class="fixed top-[62px] left-[57px] h-screen bg-gray-50 flex flex-col p-6 w-[350px] border-r border-gray-200 z-50">

    <!-- Menu icons vertically centered -->
    <div class="flex-1 flex flex-col overflow-y-auto gap-1">
      
      <router-link 
        to="/setting/general"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        General Settings
      </router-link>

      <router-link 
        to="/setting/user"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        User & Access Management
      </router-link>


      <router-link 
        to="/setting/inventory-product"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        Inventory / Product Settings
      </router-link>

      <router-link 
        to="/setting/purchase-supplier"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        Purchase / Supplier Settings
      </router-link>

      <router-link 
        to="/setting/sale-transaction"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        Sales / Transaction Settings
      </router-link>

      <router-link 
        to="/setting/accounting-finance"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        Accounting / Financial Settings
      </router-link>

      <router-link 
        to="/setting/notification"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        Notifications / Alerts
      </router-link>

      <router-link 
        to="/setting/system"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        System / Technical Settings
      </router-link>

    </div>

  </div>
</template>
