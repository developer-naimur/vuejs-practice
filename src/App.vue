<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

import Header from '@/components/inc/Header.vue'
import MainSidebar from '@/components/inc/MainSidebar.vue'


// import StockMenu from '@/components/inc/SubSidebar/StockMenu.vue'
// import ContactMenu from '@/components/inc/SubSidebar/ContactMenu.vue'
// import AccountMenu from '@/components/inc/SubSidebar/AccountMenu.vue'
// import ReportMenu from '@/components/inc/SubSidebar/ReportMenu.vue'
// import SettingsMenu from '@/components/inc/SubSidebar/SettingsMenu.vue'


// import DemoForm from '@/demoDesign/Form.vue'
// import Table from '@/demoDesign/Table.vue'
// import SinglePage from '@/demoDesign/SinglePage.vue'
// import Modal from '@/demoDesign/Modal.vue'
// import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

const currentMenu = ref('') // store current submenu
const handleMenuSelected = (menu: string) => {
  currentMenu.value = menu
}
  
</script>


<template>
  <div class="">
    <Header @menu-selected="handleMenuSelected" />

    <div class="flex lg:gap-4" id="__Main">
      <div class="flex-none">
        <MainSidebar @menu-selected="handleMenuSelected"/>
      </div>

      <div class="flex-1 mt-[55px] lg:mt-[50px] lg:ml-[40px] lg:mt-[40px] lg:p-4">
        <RouterView />
      </div>
    </div>
    
  </div>
</template>

