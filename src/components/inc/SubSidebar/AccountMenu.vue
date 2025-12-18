<script setup lang="ts">
import { onMounted } from 'vue'
</script>

<template>
  <!-- Sidebar (fixed) -->
  <div class="fixed top-[57px] left-[57px] h-screen bg-white flex flex-col p-6 w-[280px] border-r border-gray-200 z-50">

    <!-- Menu icons vertically centered -->
    <div class="flex-1 flex flex-col overflow-y-auto gap-1">
      
      <router-link 
        to="/account"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        Opening
      </router-link>
      
      <router-link 
        to="/account/income-expense"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        Other Income/Expense
      </router-link>
      
      <router-link 
        to="/account/income-expense/type"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        Other Income/Expense Type
      </router-link>

    </div>

  </div>
</template>
