<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import Header from '@/components/inc/Header.vue'
import MainSidebar from '@/components/inc/MainSidebar.vue'
import DemoForm from '@/demoDesign/Form.vue'
import Table from '@/demoDesign/Table.vue'
import SinglePage from '@/demoDesign/SinglePage.vue'
import Modal from '@/demoDesign/Modal.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
  
</script>


<template>
  <div class="">
    <Header />

    <div class="flex gap-4" id="__Main">
      <div class="flex-none">
        <MainSidebar />
      </div>
      <div class="flex-1 ml-12 mt-12 p-4">
        <Breadcrumb />
        <DemoForm />
        <Table />
        <SinglePage />
        <Modal />
          <!-- <RouterView /> -->
      </div>
    </div>
    
  </div>
</template>
