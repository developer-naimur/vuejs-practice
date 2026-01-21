<script setup>
defineProps({
  columns: {
    type: Number,
    default: 3,
  },
  rows: {
    type: Number,
    default: 1,
  }
})
</script>

<template>
  <div class="space-y-6">
    <div 
      class="grid gap-4" 
      :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
    >
      <div v-for="i in (rows * columns)" :key="i" class="space-y-2">
        <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        <div class="h-12 bg-gray-100 border border-gray-200 rounded animate-pulse"></div>
      </div>
    </div>

    <div class="h-12 bg-gray-200 rounded animate-pulse w-full mt-4"></div>
  </div>
</template>