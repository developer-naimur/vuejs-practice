<script setup>
defineProps({
  colspan: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <tr v-for="i in 5" :key="'skeleton-'+i">
    <td :colspan="colspan" class="px-4 py-3">
      <div class="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
    </td>
  </tr>
</template>