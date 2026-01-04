<template>
  <div class="flex space-x-2 items-end h-64">
    <div v-for="i in 7" :key="'skeleton-'+i" class="flex flex-col items-center space-y-1">
      
      <!-- Return Skeleton (Red) -->
      <div class="w-6 h-6 bg-red-300 rounded animate-pulse"></div>
      
      <!-- Sales Skeleton (Blue) -->
      <div class="w-6 h-20 bg-blue-300 rounded animate-pulse"></div>
      
      <!-- Day Label -->
      <div class="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
</template>

<script setup>
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>
