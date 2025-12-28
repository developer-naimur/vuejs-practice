<script setup>
import { ref, computed } from 'vue'
import StockMenu from '@/components/inc/SubSidebar/StockMenu.vue'
</script>

<template>

<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <StockMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4">

    Stock Page

  </div>

</div>

</template>
