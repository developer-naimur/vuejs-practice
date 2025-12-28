<script setup>
import { ref } from 'vue'
import ProductMenu from '@/components/inc/SubSidebar/ProductMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Product', to: '/product' },
  { label: 'Add New Product' }
]

const brands = ['Apple', 'Samsung', 'Sony']
const units = ['PCS', 'KG', 'Litre']

const newProducts = ref([
  {
    name: '',
    brand: '',
    cost_price: '',
    sold_price: '',
    vat: '',
    discount: '',
    discount_type: 'Flat',
    unit: '',
    file: null,
    description: '',
    status: ''
  }
])

const addProductField = () => {
  newProducts.value.push({
    name: '',
    brand: '',
    cost_price: '',
    sold_price: '',
    vat: '',
    discount: '',
    discount_type: 'Flat',
    unit: '',
    file: null,
    description: '',
    status: ''
  })
}

const copyProductField = index => {
  const productToCopy = { ...newProducts.value[index] }
  newProducts.value.splice(index + 1, 0, productToCopy)
}

const removeProductField = index => {
  if (newProducts.value.length > 1) {
    newProducts.value.splice(index, 1)
  }
}

const handleFile = (e, index) => {
  newProducts.value[index].file = e.target.files[0]
}

const submitProducts = () => {
  console.log(newProducts.value)
}
</script>

<template>


<div class="flex gap-4">

  <div class="flex-none">
    <ProductMenu />
  </div>

  <div class="flex-1 ml-[320px] p-4 space-y-6">

    <Breadcrumb :items="breadcrumbs" />

   <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <!-- Title + Total -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">Add New Unit</h2>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 flex-wrap">
        <router-link to="/product" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1" ry="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1" ry="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1" ry="1"/>
        </svg>
          View All
        </router-link>

        <router-link to="/product/trashed" class="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
                     01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0
                     011-1h4a1 1 0 011 1v2" />
          </svg>
          Trash
        </router-link>

        <label class="flex items-center gap-2 px-4 py-2 rounded bg-yellow-400 text-white hover:bg-yellow-500 transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4 16v4h16v-4M12 12v8m0 0l-4-4m4 4l4-4M12 4v8" />
          </svg>
          Import
          <input type="file" class="hidden" accept=".csv" />
        </label>
      </div>
    </div>

    <form @submit.prevent="submitProducts" class="space-y-4">

      <div
        v-for="(product, index) in newProducts"
        :key="index"
        class="bg-white pb-5 border-b border-gray-200 transition relative space-y-4"
      >

        <!-- Row 1 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input v-model="product.name" placeholder="Product Name" class="border p-3" />

          <select v-model="product.brand" class="border p-3">
            <option value="">Select Brand</option>
            <option v-for="b in brands" :key="b">{{ b }}</option>
          </select>

          <select v-model="product.unit" class="border p-3">
            <option value="">Select Unit</option>
            <option v-for="u in units" :key="u">{{ u }}</option>
          </select>

          <select v-model="product.status" class="border p-3">
            <option value="">Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <!-- Row 2 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="number" v-model="product.cost_price" placeholder="Cost Price" class="border p-3" />
          <input type="number" v-model="product.sold_price" placeholder="Sold Price" class="border p-3" />
          <input type="number" v-model="product.vat" placeholder="VAT" class="border p-3" />
          <input type="number" v-model="product.discount" placeholder="Discount" class="border p-3" />
        </div>

        <!-- Row 3 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select v-model="product.discount_type" class="border p-3">
            <option>Flat</option>
            <option>Percent</option>
          </select>

          <input type="file"
            @change="e => handleFile(e, index)"
            class="border p-2 col-span-1 md:col-span-3" />
        </div>

        <!-- Description -->
        <textarea
          v-model="product.description"
          placeholder="Description"
          rows="3"
          class="w-full border p-3"></textarea>

        <!-- ACTION BUTTONS (100% SAME AS YOUR CODE) -->
        <div class="w-36 flex gap-2">

          <!-- Remove -->
          <button type="button" @click="removeProductField(index)"
            :disabled="newProducts.length === 1"
            class="w-12 h-12 flex items-center justify-center rounded-md
                   bg-red-100 text-red-600 hover:bg-red-600 hover:text-white
                   transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Copy -->
          <button v-if="index === newProducts.length - 1"
            type="button" @click="copyProductField(index)"
            class="w-12 h-12 flex items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2"/>
              <rect x="8" y="8" width="12" height="12" rx="2" ry="2"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 12v4m2-2h-4"/>
            </svg>
          </button>

          <!-- Add -->
          <button v-if="index === newProducts.length - 1"
            type="button" @click="addProductField"
            class="w-12 h-12 flex items-center justify-center rounded-md bg-green-500 text-white cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
          </button>

        </div>

      </div>

      <button
        type="submit"
        class="w-full bg-gray-500 text-white font-semibold p-3 hover:bg-gray-600 transition">
        Submit All Products
      </button>

    </form>
  </div>

</div>
</template>
