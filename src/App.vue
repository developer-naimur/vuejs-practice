<script setup lang="ts">
// import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

import Header from '@/components/inc/Header.vue'
import MainSidebar from '@/components/inc/MainSidebar.vue'
import ProductMenu from '@/components/inc/SubSidebar/ProductMenu.vue'
import SalesMenu from '@/components/inc/SubSidebar/SalesMenu.vue'
import PurchaseMenu from '@/components/inc/SubSidebar/PurchaseMenu.vue'

import ContactMenu from '@/components/inc/SubSidebar/ContactMenu.vue'
import AccountMenu from '@/components/inc/SubSidebar/AccountMenu.vue'


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

        <Transition name="slide-fade">
          <PurchaseMenu v-if="currentMenu == 'purchase'" />
        </Transition>

        <Transition name="slide-fade">
          <ContactMenu v-if="currentMenu == 'contact'" />
        </Transition>

        <Transition name="slide-fade">
          <AccountMenu v-if="currentMenu == 'account'" />
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

