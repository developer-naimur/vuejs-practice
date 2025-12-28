<script setup>
import { ref, computed } from 'vue'
import ProductMenu from '@/components/inc/SubSidebar/ProductMenu.vue'
</script>

<template>

<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <ProductMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4">

    Product Page

  </div>

</div>

</template>
