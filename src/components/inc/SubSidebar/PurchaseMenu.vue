<script setup lang="ts">
import { onMounted } from 'vue'
</script>

<template>
  <!-- Sidebar (fixed) -->
  <div class="fixed top-[62px] left-[57px] h-screen bg-gray-50 flex flex-col p-6 w-[350px] border-r border-gray-200 z-50">

    <!-- Menu icons vertically centered -->
    <div class="flex-1 flex flex-col overflow-y-auto gap-1">
      
      <router-link 
        to="/purchase"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <!-- Left arrow icon -->
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        Purchase Lists
      </router-link>

      <router-link 
        to="/get-supplier"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        Add New Purchase
      </router-link>

      <router-link 
        to=""
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        Purchase Return
      </router-link>

    </div>

  </div>
</template>
