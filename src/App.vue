<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref, computed, watchEffect } from 'vue'

import Header from '@/components/inc/Header.vue'
import MainSidebar from '@/components/inc/MainSidebar.vue'
import GlobalMessage from '@/components/GlobalMessage.vue'
import SoftDeleteConfirmModal from '@/components/SoftDeleteConfirmModal.vue'

const currentMenu = ref('')
const handleMenuSelected = (menu: string) => {
  currentMenu.value = menu
}

const route = useRoute()
const authRoutes = ['/login', '/register']
const isAuthRoute = computed(() => authRoutes.includes(route.path))

</script>

<template>
  <div>
    <!-- Only show header/sidebar if not auth route -->
    <Header v-if="!isAuthRoute" @menu-selected="handleMenuSelected" />

    <div class="flex lg:gap-4" id="__Main">
      <div class="flex-none" v-if="!isAuthRoute">
        <MainSidebar @menu-selected="handleMenuSelected"/>
      </div>

      <div
        :class="[
          'flex-1',
          !isAuthRoute ? 'mt-[55px] lg:mt-[50px] lg:ml-[40px] lg:mt-[40px] lg:p-4' : 'bg-gray-100 flex items-center justify-center h-screen'
        ]"
      >
        <GlobalMessage />
        <SoftDeleteConfirmModal />
        <RouterView />
      </div>
    </div>
  </div>
</template>
