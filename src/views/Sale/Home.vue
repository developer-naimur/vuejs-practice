<script setup>
import { ref, computed } from 'vue'
import SalesMenu from '@/components/inc/SubSidebar/SalesMenu.vue'
</script>

<template>

<div class="flex gap-4">

  <div class="flex-none">
    <SalesMenu />
  </div>

  <div class="flex-1 ml-[320px] p-4">

    Sales Page

  </div>

</div>

</template>
