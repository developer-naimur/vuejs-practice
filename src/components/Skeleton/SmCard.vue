<script setup>
defineProps({
  cardNumber: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div
    v-for="i in cardNumber"
    :key="'kpi-skeleton-' + i"
    class="p-5 rounded-lg shadow bg-white"
  >
    <div class="h-4 w-24 bg-gray-200 rounded mb-3 animate-pulse"></div>

    <div class="relative overflow-hidden h-7 w-32 bg-gray-200 rounded animate-pulse">
      <div
        class="absolute inset-0 -translate-x-full animate-shimmer
               bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200">
      </div>
    </div>
  </div>
</template>