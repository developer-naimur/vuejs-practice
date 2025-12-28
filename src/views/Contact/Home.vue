<script setup>
import { ref, computed } from 'vue'
import ContactMenu from '@/components/inc/SubSidebar/ContactMenu.vue'
</script>

<template>

<div class="flex gap-4">

  <div class="flex-none">
    <ContactMenu />
  </div>

  <div class="flex-1 ml-[320px] p-4">

    Contact Page

  </div>

</div>

</template>
