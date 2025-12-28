<script setup>
import { ref, computed } from 'vue'
import ReportMenu from '@/components/inc/SubSidebar/ReportMenu.vue'
</script>

<template>

<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <ReportMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4">

    Report Page

  </div>

</div>

</template>
