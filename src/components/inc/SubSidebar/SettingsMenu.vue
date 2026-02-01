<script setup lang="ts">
import { ref } from 'vue'

const menus = ref([
  { label: 'General Settings', to: '/setting/general' },
  { label: 'User & Access Management', to: '/setting/user' },
  { label: 'Payment Method', to: '/setting/payment-method' },
  { label: 'Price Group', to: '/setting/price-group' },
  { label: 'Area/Route', to: '/setting/route' },
  { label: 'Warehouse', to: '/setting/warehouse' },
  { label: 'Tax', to: '/setting/tax' },
  { label: 'Adjustment Head', to: '/setting/adjustment-head' },
  //{ label: 'Inventory / Product Settings', to: '/setting/inventory-product' },
  //{ label: 'Purchase / Supplier Settings', to: '/setting/purchase-supplier' },
  //{ label: 'Sales / Transaction Settings', to: '/setting/sale-transaction' },
  //{ label: 'Accounting / Financial Settings', to: '/setting/accounting-finance' },
  //{ label: 'Notifications / Alerts', to: '/setting/notification' },
  //{ label: 'System / Technical Settings', to: '/setting/system' }
])
</script>

<template>
  <!-- Sidebar (fixed) -->
  <div
    class="fixed top-[57px] left-[57px] h-screen bg-gray-50 flex flex-col p-6 w-[350px] border-r border-gray-200 z-50"
  >
    <div class="flex-1 flex flex-col overflow-y-auto gap-1">

      <router-link
        v-for="menu in menus"
        :key="menu.to"
        :to="menu.to"
        class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <svg
          class="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
        {{ menu.label }}
      </router-link>

    </div>
  </div>
</template>
