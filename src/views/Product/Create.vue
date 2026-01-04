<script setup>
import { ref } from 'vue'
import FormSkeleton from '@/components/skeleton/Form-1.vue'
import ProductMenu from '@/components/inc/SubSidebar/ProductMenu.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import { $routes, $labels } from '@/constants/product'


/* =====================================================
   BREADCRUMB
===================================================== */
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: $labels.plural_name, to: $routes.index },
  { label: 'Add New ' + $labels.singular_name, }
]


/* =====================================================
   Add Row
===================================================== */
const brands = ['Apple', 'Samsung', 'Sony']
const units = ['PCS', 'KG', 'Litre']
const newRows = ref([
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
const addRowField = () => {
  newRows.value.push({
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

/* =====================================================
   Copy Row
===================================================== */
const copyRowField = index => {
  const rowToCopy = { ...newRows.value[index] }
  newRows.value.splice(index + 1, 0, rowToCopy)
}

/* =====================================================
   Remove Row
===================================================== */
const removeRowField = index => {
  if (newRows.value.length > 1) {
    newRows.value.splice(index, 1)
  }
}

/* =====================================================
   File Handle
===================================================== */
const handleFile = (e, index) => {
  newRows.value[index].file = e.target.files[0]
}


/* =====================================================
   Submit Rows
===================================================== */
const submitRows = () => {
  console.log(newRows.value)
}


</script>

<template>


<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <ProductMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

    <Breadcrumb :items="breadcrumbs" />

   <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <!-- Title + Total -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">Add New {{ $labels.singular_name }}</h2>
      </div>

      <!-- Buttons -->
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


    <FormSkeleton rows="4" columns="4"/>

    <form @submit.prevent="submitRows" class="space-y-4" >


      <div
        v-for="(row, index) in newRows"
        :key="index"
        class="bg-white pb-5 border-b border-gray-200 transition relative space-y-4"
      >

        <!-- Row 1 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input v-model="row.name" placeholder="Name" class="border p-3" />

          <select v-model="row.brand" class="border p-3">
            <option value="">Select Brand</option>
            <option v-for="b in brands" :key="b">{{ b }}</option>
          </select>

          <select v-model="row.unit" class="border p-3">
            <option value="">Select Unit</option>
            <option v-for="u in units" :key="u">{{ u }}</option>
          </select>

          <select v-model="row.status" class="border p-3">
            <option value="">Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <!-- Row 2 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="number" v-model="row.cost_price" placeholder="Cost Price" class="border p-3" />
          <input type="number" v-model="row.sold_price" placeholder="Sold Price" class="border p-3" />
          <input type="number" v-model="row.vat" placeholder="VAT" class="border p-3" />
          <input type="number" v-model="row.discount" placeholder="Discount" class="border p-3" />
        </div>

        <!-- Row 3 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select v-model="row.discount_type" class="border p-3">
            <option>Flat</option>
            <option>Percent</option>
          </select>

          <input type="file"
            @change="e => handleFile(e, index)"
            class="border p-2 col-span-1 md:col-span-3" />
        </div>

        <!-- Description -->
        <textarea
          v-model="row.description"
          placeholder="Description"
          rows="3"
          class="w-full border p-3"></textarea>

        <!-- ACTION BUTTONS (100% SAME AS YOUR CODE) -->
        <div class="w-36 flex gap-2">

          <!-- Remove -->
          <button type="button" @click="removeRowField(index)"
            :disabled="newRows.length === 1"
            class="w-12 h-12 flex items-center justify-center rounded-md
                   bg-red-100 text-red-600 hover:bg-red-600 hover:text-white
                   transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Copy -->
          <button v-if="index === newRows.length - 1"
            type="button" @click="copyRowField(index)"
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
          <button v-if="index === newRows.length - 1"
            type="button" @click="addRowField"
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
        Submit All {{ $labels.plural_name }}
      </button>

    </form>
  </div>

</div>
</template>
