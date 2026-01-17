<script setup lang="ts">
import { ref, computed } from 'vue'
import TableSkeleton from '@/components/Skeleton/Table.vue'
import FormSkeleton from '@/components/skeleton/Form-1.vue'
import StockMenu from '@/components/inc/SubSidebar/StockMenu.vue'
import { useRouter } from 'vue-router'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import { $routes, $labels } from '@/constants/stockAdjustment'
const router = useRouter()

import { useMessageStore } from '@/stores/useMessageStore'
const messageStore = useMessageStore()

import axiosInstance from '@/axiosInstance';
import { AxiosError } from "axios";

import { useUserStore } from "@/stores/useUserStore";
const userStore = useUserStore();


/* =====================================================
   BREADCRUMB
===================================================== */
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: $labels.plural_name, to: $routes.index },
  { label: 'Add New ' + $labels.singular_name, }
]

/* =====================================================
   Filters & Pagination
===================================================== */
const searchQuery = ref('')
const resetFilters = () => searchQuery.value = ''

/* =====================================================
   MODAL STATE
===================================================== */
const open = ref(false)

/* =====================================================
   PRODUCTS DATA
===================================================== */
const allProducts = ref([
  { id: 1, name: 'Apple', brand: 'Fruit' },
  { id: 2, name: 'Banana', brand: 'Fruit' },
  { id: 3, name: 'Laptop', brand: 'Electronics' },
  { id: 4, name: 'Mouse', brand: 'Electronics' },
  { id: 5, name: 'Keyboard', brand: 'Electronics' }
])

/* =====================================================
   Filters
===================================================== */
const selectedProducts = ref([])
const search = ref('')
const brand = ref('')
const brands = computed(() => [...new Set(allProducts.value.map(p => p.brand))])
const products = computed(() => {
  return allProducts.value.filter(p => {
    const matchName = p.name.toLowerCase().includes(search.value.toLowerCase())
    const matchBrand = brand.value ? p.brand === brand.value : true
    const notSelected = !selectedProducts.value.find(sp => sp.id === p.id)
    return matchName && matchBrand && notSelected
  })
})

/* =====================================================
   ACTIONS
===================================================== */
const addProduct = (product) => {
  selectedProducts.value.push({ ...product, qty: 1})
}
const removeProduct = (product) => {
  selectedProducts.value = selectedProducts.value.filter(p => p.id !== product.id)
}
const updateQty = (p, type) => {
  if (type === 'plus') p.qty++
  if (type === 'minus' && p.qty > 1) p.qty--
}


/* =====================================================
   OPERATION META
===================================================== */
const operationDate = ref(new Date().toISOString().slice(0, 10))
const operationType = ref('')
const direction = ref('')
const note = ref('')
const partyType = ref('system')
const partyId = ref(null)

const customers = ref([
  { id: 1, name: 'Rahim' },
  { id: 2, name: 'Karim' }
])
const suppliers = ref([
  { id: 1, name: 'ABC Supplier' },
  { id: 2, name: 'XYZ Supplier' }
])


/* =====================================================
   Reset party when type changes
===================================================== */
const onPartyTypeChange = () => {
  partyId.value = null
}
</script>

<template>
  <div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <StockMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <h2 class="text-2xl font-semibold text-gray-700">Add {{ $labels.singular_name }}</h2>

      <div class="flex gap-2 flex-wrap">
        <router-link :to="$routes.index" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1" ry="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1" ry="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1" ry="1"/>
        </svg>
          View All
        </router-link>

        <router-link :to="$routes.trash" class="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
                     01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0
                     011-1h4a1 1 0 011 1v2" />
          </svg>
          Trash
        </router-link>
      </div>
    </div>

    <FormSkeleton rows="5" columns="1"/>

	<!-- ================= OPERATION INFO ================= -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 p-4 bg-white">

	  <!-- Operation Date -->
	  <div>
	    <label class="block font-medium mb-1">Operation Date</label>
	    <input type="date" v-model="operationDate"
	           class="w-full border p-2 focus:ring-2 focus:ring-gray-500" />
	  </div>

	  <!-- Operation Type -->
	  <div>
	    <label class="block font-medium mb-1">Operation Type</label>
	    <select v-model="operationType"
	            class="w-full border p-2 focus:ring-2 focus:ring-gray-500">
	      <option value="">Select</option>
	      <option value="customer_adjustment">Customer Adjustment</option>
	      <option value="supplier_adjustment">Supplier Adjustment</option>
	      <option value="damage">Damage</option>
	      <option value="free">Free</option>
	    </select>
	  </div>

	  <!-- Direction -->
	  <div>
	    <label class="block font-medium mb-1">Direction</label>
	    <select v-model="direction"
	            class="w-full border p-2 focus:ring-2 focus:ring-gray-500">
	      <option value="">Select</option>
	      <option value="in">In</option>
	      <option value="out">Out</option>
	    </select>
	  </div>

	  <!-- Party Type -->
	  <div>
	    <label class="block font-medium mb-1">Party Type</label>
	    <select v-model="partyType" @change="onPartyTypeChange"
	            class="w-full border p-2 focus:ring-2 focus:ring-gray-500">
	      <option value="system">System</option>
	      <option value="customer">Customer</option>
	      <option value="supplier">Supplier</option>
	    </select>
	  </div>

	  <!-- Party -->
	  <div v-if="partyType !== 'system'">
	    <label class="block font-medium mb-1">
	      {{ partyType === 'customer' ? 'Customer' : 'Supplier' }}
	    </label>

	    <select v-model="partyId"
	            class="w-full border p-2 focus:ring-2 focus:ring-gray-500">
	      <option value="">Select</option>

	      <option v-if="partyType === 'customer'"
	              v-for="c in customers" :key="c.id" :value="c.id">
	        {{ c.name }}
	      </option>

	      <option v-if="partyType === 'supplier'"
	              v-for="s in suppliers" :key="s.id" :value="s.id">
	        {{ s.name }}
	      </option>
	    </select>
	  </div>


	</div>


    <!-- Get Products Button -->
    <button
      type="button"
      @click="open = true"
      class="text-2xl w-full bg-yellow-500 text-white font-semibold p-4 hover:bg-yellow-600 transition cursor-pointer"
    >
      Get Products
    </button>

    <!-- Selected Products Table -->
    <div v-if="selectedProducts.length" class="border border-gray-200 p-4 bg-white space-y-4 mb-0">
      <h3 class="text-lg font-semibold text-gray-700">Selected Products</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">Product</th>
              <th class="px-4 py-2 text-center">Qty</th>
              <th class="px-4 py-2 text-left">Remove</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">

            <TableSkeleton :colspan="100" />

            <tr v-for="p in selectedProducts" :key="p.id" class="hover:bg-gray-50">
              <td class="px-4 py-2">{{ p.name }}</td>
              <td class="px-4 py-2 text-center">
                <div class="flex justify-center">
                  <div class="flex border rounded overflow-hidden">
                    <!-- Minus Button -->
                    <button
                      @click="updateQty(p, 'minus')"
                      class="px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                    </svg>
                    </button>

                    <!-- Quantity Input -->
                    <input
                      type="number"
                      v-model.number="p.qty"
                      min="1"
                      class="w-16 text-center border-l border-r focus:outline-none"
                    />

                    <!-- Plus Button -->
                    <button
                      @click="updateQty(p, 'plus')"
                      class="px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2 text-center">
                <button @click="removeProduct(p)" class="text-red-600 cursor-pointer">✕</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Note -->
    <div class="border border-gray-200 p-4 mb-0">
      <label class="block font-medium mb-1">Note</label>
      <textarea v-model="note" class="w-full border p-2 focus:ring-2 focus:ring-gray-500" rows="3" placeholder="note..."></textarea>
    </div>


    <!-- Submit -->
    <button
      type="button"
      class="w-full bg-gray-500 text-white font-semibold p-3 hover:bg-gray-600 transition cursor-pointer"
    >
      Submit
    </button>

    <!-- ================= PRODUCT POPUP ================= -->
    <div
      v-if="open"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-100"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full h-[70vh] flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700">Select Products</h3>
          <button @click="open = false" class="text-gray-500 hover:text-red-600 text-2xl">✕</button>
        </div>
        <!-- Filters -->
        <div class="px-4 py-3 border border-gray-200 bg-gray-50 flex gap-3">
          <div class="w-full md:w-1/3">
            <input v-model="searchQuery" type="text" placeholder="Search..."
                   class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none" />
          </div>
          <div class="w-full md:w-1/5">
            <select v-model="brand" class="border border-gray-300 p-2 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none">
            <option value="">All Brands</option>
            <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
            </select>
          </div>
          <div class="flex gap-2 w-full md:w-auto">
            <button class="flex items-center gap-2 px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/>
              </svg>
              Search
            </button>
            <button class="flex items-center gap-2 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                    @click="resetFilters">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Cancel
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
          <!-- Products -->
          <div class="col-span-2 border border-gray-200 overflow-hidden flex flex-col">
            <div class="px-4 py-2 font-semibold">Products</div>
            <div class="flex-1 overflow-y-auto">
              <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-4 py-2">Name</th>
                    <th class="px-4 py-2">Brand</th>
                    <th class="px-4 py-2 text-center w-16">Add</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">

                  <TableSkeleton :colspan="100" />

                  <tr v-for="p in products" :key="p.id" class="hover:bg-gray-50">
                    <td class="px-4 py-2 font-medium">{{ p.name }}</td>
                    <td class="px-4 py-2 text-gray-500">{{ p.brand }}</td>
                    <td class="px-4 py-2 text-center">
                      <button @click="addProduct(p)" class="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 cursor-pointer">+</button>
                    </td>
                  </tr>
                  <tr v-if="products.length === 0" class="hover:bg-gray-50">
                    <td colspan="4" class="text-center py-6 text-gray-400">No products found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- Selected Products in Popup -->
          <div class="border border-gray-200 overflow-hidden flex flex-col">
            <div class="bg-gray-100 px-4 py-2 font-semibold flex justify-between">
              <span>Selected</span>
              <span class="text-sm text-gray-600">{{ selectedProducts.length }} items</span>
            </div>
            <div class="flex-1 overflow-y-auto divide-y">
              <div v-for="p in selectedProducts" :key="p.id" class="flex justify-between items-center px-4 py-2">
                <div>
                  <p class="font-medium">{{ p.name }}</p>
                  <p class="text-xs text-gray-500">৳ {{ p.price }}</p>
                </div>
                <button @click="removeProduct(p)" class="w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 cursor-pointer">−</button>
              </div>
              <div v-if="selectedProducts.length === 0" class="text-center text-gray-400 py-6">No product selected</div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 px-6 py-3 flex justify-end">
          <button @click="open = false"
                  class="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-2 cursor-pointer">
            <!-- Icon (checkmark) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Done
          </button>
        </div>

      </div>
    </div>

  </div>
  
</div>
</template>
