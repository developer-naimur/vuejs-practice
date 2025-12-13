<script setup lang="ts">
// import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

import Header from '@/components/inc/Header.vue'
import MainSidebar from '@/components/inc/MainSidebar.vue'
import ProductMenu from '@/components/inc/SubSidebar/ProductMenu.vue'
import SalesMenu from '@/components/inc/SubSidebar/SalesMenu.vue'


import DemoForm from '@/demoDesign/Form.vue'
import Table from '@/demoDesign/Table.vue'
import SinglePage from '@/demoDesign/SinglePage.vue'
import Modal from '@/demoDesign/Modal.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

const currentMenu = ref('') // store current submenu
const handleMenuSelected = (menu: string) => {
  currentMenu.value = menu
}
  
</script>


<template>
  <div class="">
    <Header @menu-selected="handleMenuSelected" />

    <div class="flex gap-4" id="__Main">
      <div class="flex-none">
        <MainSidebar @menu-selected="handleMenuSelected"/>

        <Transition name="slide-fade">
          <ProductMenu v-if="currentMenu == 'product'" />
        </Transition>

        <Transition name="slide-fade">
          <SalesMenu v-if="currentMenu == 'sales'" />
        </Transition>
      </div>


      <Transition name="slide-fade">
        <template v-if="currentMenu">
          <div class="flex-1 ml-[340px] mt-[70px] p-4">
            <!-- <Breadcrumb />
            <DemoForm />
            <Table />
            <SinglePage />
            <Modal /> -->
              <RouterView />
          </div>
        </template>

        <template v-else>
          <div class="flex-1 ml-[60px] mt-[70px] p-4">
            <!-- <Breadcrumb />
            <DemoForm />
            <Table />
            <SinglePage />
            <Modal /> -->
              <RouterView />
          </div>
        </template>
      </Transition>


    </div>
    
  </div>
</template>


<style>
/* Slide + fade animation */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>