<script setup>
import { ref, computed } from 'vue'
import SettingsMenu from '@/components/inc/SubSidebar/SettingsMenu.vue'
</script>

<template>

<div class="flex gap-4">

  <div class="flex-none">
    <SettingsMenu />
  </div>

  <div class="flex-1 ml-[320px] p-4">

    Setting Page

  </div>

</div>

</template>
