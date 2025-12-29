<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
const openParents = ref<string[]>([])

const hideMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  openParents.value = []
}

const toggleParent = (label: string) => {
  if (openParents.value.includes(label)) {
    openParents.value = openParents.value.filter(l => l !== label)
  } else {
    openParents.value.push(label)
  }
}

const iconMenus = ref([
  { label: 'Sales', to: '/sale/home', icon: '/public/icons/sales.png' },
  { label: 'Purchase', to: '/purchase/home', icon: '/public/icons/purchase.png' },
  { label: 'Product', to: '/product/home', icon: '/public/icons/product.png' },
  { label: 'Stock', to: '/stock/home', icon: '/public/icons/stock.png' },
  { label: 'Contacts', to: '/contact/home', icon: '/public/icons/contact.png' },
  { label: 'Accounts', to: '/account/home', icon: '/public/icons/accounts.png' },
  { label: 'Reports', to: '/report/home', icon: '/public/icons/reports.png' },
  { label: 'Settings', to: '/setting/home', icon: '/public/icons/settings.png' }
])

const mobileMenus = [
  {
    label: 'Sales',
    children: [
      { label: 'Sale Lists', to: '/sale/retail-sale' },
      { label: 'Add New Sale', to: '/get-customer' },
      { label: 'Sales Return', to: '/sale/return' }
    ]
  },
  {
    label: 'Purchase',
    children: [
      { label: 'Purchase Lists', to: '/purchase' },
      { label: 'Add New Purchase', to: '/get-supplier' },
      { label: 'Purchase Return', to: '/purchase/return' }
    ]
  },
  {
    label: 'Products',
    children: [
      { label: 'Product Lists', to: '/product' },
      { label: 'Add New Product', to: '/product/create' },
      { label: 'Brands', to: '/product/brand' },
      { label: 'Units', to: '/product/unit' }
    ]
  },
  {
    label: 'Stocks',
    children: [
      { label: 'Stock Operation Lists', to: '/stock/operation' },
      { label: 'Add Operation', to: '/stock/operation/create' }
    ]
  },
  {
    label: 'Contacts',
    children: [
      { label: 'Customers', to: '/customer' },
      { label: 'Suppliers', to: '/supplier' }
    ]
  },
  {
    label: 'Accounts',
    children: [
      { label: 'Opening', to: '/account' },
      { label: 'Fund Transfer', to: '/account/fund-transfer' },
      { label: 'Other Income/Expense', to: '/account/income-expense' },
      { label: 'Other Income/Expense Type', to: '/account/income-expense/type' }
    ]
  },
  {
    label: 'Reports',
children: [
      {
        label: 'Purchase Reports',
        children: [
          { label: 'Purchase Summary', to: '/reports/purchase-summary' },
          { label: 'Supplier Wise Purchase', to: '/reports/supplier-purchase' },
          { label: 'Purchase Return', to: '/reports/purchase-return' }
        ]
      },
      {
        label: 'Sales Reports',
        children: [
          { label: 'Sales Summary', to: '/reports/sales-summary' },
          { label: 'Customer Wise Sales', to: '/reports/customer-sales' },
          { label: 'Sales Return', to: '/reports/sales-return' },
          { label: 'Top Selling Products', to: '/reports/top-products' }
        ]
      },
      {
        label: 'Stock Reports',
        children: [
          { label: 'Current Stock', to: '/reports/current-stock' },
          { label: 'Stock Movement', to: '/reports/stock-movement' },
          { label: 'Stock Adjustment', to: '/reports/stock-adjustment' },
          { label: 'Damage / Wastage', to: '/reports/damage-wastage' }
        ]
      },
      {
        label: 'Accounts Reports',
        children: [
          { label: 'Cash Report', to: '/reports/cash-report' },
          { label: 'Bank Report', to: '/reports/bank-report' },
          { label: 'Profit & Loss', to: '/reports/profit-loss' },
          { label: 'Balance Sheet', to: '/reports/balance-sheet' }
        ]
      },
      {
        label: 'Customer Reports',
        children: [
          { label: 'Customer Ledger', to: '/reports/customer-ledger' },
          { label: 'Customer Due', to: '/reports/customer-due' },
          { label: 'Top Customers', to: '/reports/top-customers' }
        ]
      },
      {
        label: 'Supplier Reports',
        children: [
          { label: 'Supplier Ledger', to: '/reports/supplier-ledger' },
          { label: 'Supplier Due', to: '/reports/supplier-due' },
          { label: 'Top Suppliers', to: '/reports/top-suppliers' }
        ]
      }
    ]
  },
  {
    label: 'Settings',
    children: [
      { label: 'General', to: '/setting/general' },
      { label: 'User & Access Management', to: '/setting/user' },
      { label: 'Stock / Product', to: '/setting/inventory-product' },
      { label: 'Purchase / Supplier', to: '/setting/purchase-supplier' },
      { label: 'Sales / Transaction', to: '/setting/sale-transaction' },
      { label: 'Accounting / Financial', to: '/setting/accounting-finance' },
      { label: 'Notification / Alert', to: '/setting/notification' },
      { label: 'System / Technical', to: '/setting/system' }
    ]
  },
]
</script>

<template>
  <div class="fixed top-0 left-0 w-screen flex items-center lg:gap-10 bg-gray-200 p-2 border-b border-gray-200 z-50 overflow-visible" id="__header">
    
    <router-link  @click="hideMobileMenu" to="/dashboard" class="lg:hidden cursor-pointer">
      <img class="p-2 w-auto h-10" src="/public/mobile-logo.png" alt="logo" />
    </router-link>

    <!-- icon menus -->
      <div class="hidden lg:block flex-1 text-center overflow-visible">
        <div class="flex gap-4 items-center justify-end">

          <div
            v-for="menu in iconMenus"
            :key="menu.to"
            class="relative flex flex-col items-center group overflow-visible"
          >
            <router-link :to="menu.to" class="cursor-pointer">
              <img
                :src="menu.icon"
                :alt="menu.label.toLowerCase()"
                class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10"
              />
            </router-link>
            <span
              class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[9999]"
            >
              {{ menu.label }}
            </span>
          </div>

        </div>
      </div>
    <!-- end icon menus -->



    <div class="flex-1 flex justify-end lg:hidden overflow-visible">
      <div class="flex-1 flex justify-end lg:hidden">
        <button @click="toggleMobileMenu">
          <img
            v-if="!mobileMenuOpen"
            class="p-2 w-10 h-10"
            src="/public/icons/menu.png"
            alt="menu"
          />
          <img
            v-else
            class="p-2 w-10 h-10"
            src="/public/icons/close.png"
            alt="close"
          />
        </button>
    </div>
    </div>
    <div class="flex-none lg:pr-3">
      <router-link  @click="hideMobileMenu" class="cursor-pointer" to="/setting/profile">
        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/profile.png" alt="profile" />
      </router-link>
    </div>



  <!-- Mobile Menu -->
  <transition name="mobile-slide">
  <aside
    v-if="mobileMenuOpen"
    @click.stop
    class="fixed top-[57px] left-0 h-[calc(100vh-57px)]
           w-[340px] bg-white z-50 lg:hidden
           shadow-2xl border-r border-gray-200
           overflow-y-auto"
  >

    <!-- Header -->
    <div class="px-5 py-4 border-b bg-gray-50">
      <h2 class="text-sm font-semibold text-gray-500 uppercase">
        Navigation
      </h2>
    </div>

    <!-- Menu -->
    <div class="p-4 space-y-1">

      <template v-for="menu in mobileMenus" :key="menu.label">

        <!-- Parent -->
        <button
          @click="toggleParent(menu.label)"
          class="w-full flex items-center justify-between
                 px-4 py-3 rounded-lg
                 font-semibold uppercase text-sm
                 text-gray-700
                 hover:bg-gray-100 transition"
        >
          <span>{{ menu.label }}</span>
          <svg
            class="w-4 h-4 text-gray-400 transition-transform"
            :class="{ 'rotate-90': openParents.includes(menu.label) }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Children -->
        <div
          v-if="openParents.includes(menu.label)"
          class="ml-4 mt-1 border-l border-gray-200 pl-3 space-y-1"
        >

          <template v-for="child in menu.children" :key="child.label">

            <!-- 2nd Level -->
            <div v-if="child.children">
              <button
                @click="toggleParent(child.label)"
                class="w-full flex justify-between
                       px-3 py-2 rounded-md
                       text-xs font-medium uppercase
                       text-gray-600
                       hover:bg-gray-100 transition"
              >
                <span>{{ child.label }}</span>
                <svg
                  class="w-3 h-3 text-gray-400 transition-transform"
                  :class="{ 'rotate-90': openParents.includes(child.label) }"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- 3rd Level -->
              <div
                v-if="openParents.includes(child.label)"
                class="ml-3 border-l border-gray-200 pl-3 space-y-1"
              >
                <router-link
                  v-for="sub in child.children"
                  :key="sub.label"
                  :to="sub.to"
                  @click="toggleMobileMenu"
                  class="block px-3 py-2 rounded-md
                         text-sm text-gray-600
                         hover:bg-gray-100 transition"
                >
                  {{ sub.label }}
                </router-link>
              </div>
            </div>

            <!-- Simple Child -->
            <router-link
              v-else
              :to="child.to"
              @click="toggleMobileMenu"
              class="block px-3 py-2 rounded-md
                     text-sm text-gray-600
                     hover:bg-gray-100 transition"
            >
              {{ child.label }}
            </router-link>

          </template>
        </div>

      </template>

    </div>
  </aside>
  </transition>
  <!-- end mobile menus -->

    
  </div>
</template>



<style scoped>
.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: transform 0.3s ease;
}
.mobile-slide-enter-from,
.mobile-slide-leave-to {
  transform: translateX(-100%);
}
.mobile-slide-enter-to,
.mobile-slide-leave-from {
  transform: translateX(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
