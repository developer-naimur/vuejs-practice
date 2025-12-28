<script setup>
import { ref, computed } from 'vue'
import AccountMenu from '@/components/inc/SubSidebar/AccountMenu.vue'
</script>

<template>

<div class="flex gap-4">

  <div class="flex-none">
    <AccountMenu />
  </div>

  <div class="flex-1 ml-[320px] p-4">

    Account Page

  </div>

</div>

</template>
