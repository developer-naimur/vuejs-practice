<script setup lang="ts">
defineProps<{
  currentPage: number
  lastPage: number
}>()

defineEmits(['change'])
</script>

<template>
  <div v-if="lastPage > 1" class="flex gap-1 justify-end mt-4">

    <button
      @click="$emit('change', currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer">
      Prev
    </button>

    <button
      v-for="page in lastPage"
      :key="page"
      @click="$emit('change', page)"
      :class="[
        'px-3 py-1 border rounded cursor-pointer',
        page === currentPage
          ? 'bg-gray-700 text-white'
          : 'hover:bg-gray-100'
      ]">
      {{ page }}
    </button>

    <button
      @click="$emit('change', currentPage + 1)"
      :disabled="currentPage === lastPage"
      class="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer">
      Next
    </button>

  </div>
</template>
