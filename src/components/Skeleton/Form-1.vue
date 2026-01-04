<script setup>
defineProps({
  columns: {
    type: Number,
    required: true,
    default: 1,
  },
  rows: {
    type: Number,
    required: true,
    default: 1,
  }
})
</script>



<template>
    <div :class="`grid grid-cols-${columns} gap-4`">
      <!-- Skeleton Inputs -->
      <div v-for="i in rows * columns" :key="i" class="h-10 bg-gray-200 rounded animate-pulse"></div>
      <!-- Full width skeleton button -->
      <div class="col-span-full h-10 bg-gray-300 rounded animate-pulse mt-2"></div>
    </div>
</template>