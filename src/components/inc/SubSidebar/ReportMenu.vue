<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const menus = ref([

  {
    label: 'Reports',
    children: [
      {
        label: 'Purchase Reports',
        children: [
          { label: 'Purchase Summary', to: '/report/purchase-summary' },
          { label: 'Supplier Wise Purchase', to: '/report/supplier-purchase' },
          { label: 'Purchase Return', to: '/report/purchase-return' }
        ]
      },
      {
        label: 'Sales Reports',
        children: [
          { label: 'Sales Summary', to: '/report/sales-summary' },
          { label: 'Customer Wise Sales', to: '/report/customer-sale' },
          { label: 'Sales Return', to: '/report/sales-return' },
          // { label: 'Top Selling Products', to: '/report/top-products' }
        ]
      },
      {
        label: 'Stock Reports',
        children: [
          { label: 'Current Stock', to: '/report/current-stock' },
          // { label: 'Stock Movement', to: '/report/stock-movement' },
          { label: 'Stock Adjustment', to: '/report/stock-adjustment' },
          // { label: 'Damage / Wastage', to: '/report/damage-wastage' }
        ]
      },
      {
        label: 'Accounts Reports',
        children: [
          { label: 'Cash Report', to: '/report/cash-report' },
          { label: 'Bank Report', to: '/report/bank-report' },
          { label: 'Profit & Loss', to: '/report/profit-loss' },
          // { label: 'Balance Sheet', to: '/report/balance-sheet' }
        ]
      },
      {
        label: 'Customer Reports',
        children: [
          { label: 'Customer Ledger', to: '/report/customer-ledger' },
          { label: 'Customer Due', to: '/report/customer-due' },
          { label: 'Top Customers', to: '/report/top-customer' }
        ]
      },
      {
        label: 'Supplier Reports',
        children: [
          { label: 'Supplier Ledger', to: '/report/supplier-ledger' },
          { label: 'Supplier Due', to: '/report/supplier-due' },
          { label: 'Top Suppliers', to: '/report/top-supplier' }
        ]
      }
    ]
  }
])

// -----------------------------
// Open all parents by default
// -----------------------------
const getAllParentLabels = (menus: any[]): string[] => {
  let labels: string[] = []
  for (const menu of menus) {
    if (menu.children) {
      labels.push(menu.label)
      labels = labels.concat(getAllParentLabels(menu.children))
    }
  }
  return labels
}

const openParents = ref<string[]>(getAllParentLabels(menus.value))

// Toggle (optional)
const toggleParent = (label: string) => {
  if (openParents.value.includes(label)) {
    openParents.value = openParents.value.filter(l => l !== label)
  } else {
    openParents.value.push(label)
  }
}
</script>


<template>
  <!-- Sidebar (fixed) -->
  <div class="fixed top-[57px] left-[57px] h-screen bg-gray-50 flex flex-col p-6 w-[350px] border-r border-gray-200 z-50">

    <!-- Menu icons vertically centered -->
    <div class="flex-1 flex flex-col overflow-y-auto gap-1">

      <template v-for="menu in menus" :key="menu.label">
        <!-- Parent without children -->
        <router-link
          v-if="!menu.children"
          :to="menu.to"
          class="uppercase flex items-center gap-3 p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path :d="menu.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
          </svg>
          {{ menu.label }}
        </router-link>

        <!-- Parent with children -->
        <div v-else>
          <button
            @click="toggleParent(menu.label)"
            class="flex items-center justify-between w-full p-3 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 uppercase font-semibold text-gray-700"
          >
            <span>{{ menu.label }}</span>
            <svg class="w-3 h-3 text-gray-500 transform" :class="{'rotate-90': openParents.includes(menu.label)}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <div v-if="openParents.includes(menu.label)" class="ml-4 border-l border-gray-200 pl-3">
            <template v-for="child in menu.children" :key="child.label">
              <!-- Nested parent -->
              <div v-if="child.children">
                <button
                  @click="toggleParent(child.label)"
                  class="flex items-center justify-between w-full p-2 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 uppercase text-gray-600 font-medium text-sm"
                >
                  <span>{{ child.label }}</span>
                  <svg class="w-3 h-3 text-gray-400 transform" :class="{'rotate-90': openParents.includes(child.label)}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>

                <div v-if="openParents.includes(child.label)" class="ml-4 border-l border-gray-200 pl-2">
                  <router-link
                    v-for="sub in child.children"
                    :key="sub.label"
                    :to="sub.to"
                    class="block p-2 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 text-gray-600 text-sm"
                  >
                    {{ sub.label }}
                  </router-link>
                </div>
              </div>

              <!-- Simple child -->
              <router-link v-else
                :to="child.to"
                class="block p-2 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 text-gray-600 text-sm"
              >
                {{ child.label }}
              </router-link>

            </template>
          </div>
        </div>

      </template>

    </div>
  </div>
</template>
