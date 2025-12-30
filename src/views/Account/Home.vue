<script setup>
import { ref, computed } from 'vue'
import { $routes, $labels } from '@/constants/account'
import AccountMenu from '@/components/inc/SubSidebar/AccountMenu.vue'
</script>

<template>

<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <AccountMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4">

    Account Page

  </div>

</div>

</template>
