<script setup>
import { ref, computed } from 'vue'
import PurchaseMenu from '@/components/inc/SubSidebar/PurchaseMenu.vue'
</script>

<template>

<div class="flex gap-4">

  <div class="flex-none">
    <PurchaseMenu />
  </div>

  <div class="flex-1 ml-[320px] p-4">

    Purchase Page

  </div>

</div>

</template>
