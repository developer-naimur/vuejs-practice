<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

import FormSkeleton from '@/components/Skeleton/Form-2.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import ProductMenu from '@/components/inc/SubSidebar/ProductMenu.vue'
import { useMessageStore } from '@/stores/useMessageStore'

const messageStore = useMessageStore()
const route = useRoute()
const router = useRouter()

const rowId = route.params.id

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/product' },
  { label: 'Edit Product' }
]

const processing = ref(false)
const loading = ref(true)

/* ===============================
  SINGLE ROW STATE
================================ */
const row = ref({})

/* ===============================
  FETCH TAX DATA
================================ */
const fetchRow = async () => {
  try {
    const res = await axiosInstance.get(`/products/${rowId}`)
    const data = res.data.data

    row.value = {
      name: data.name,
      sku: data.sku,
      brand_id: data.brand.id,
      category_id: data.category.id,
      cost_price: data.cost_price,
      selling_price: data.selling_price,
      tax_id: data?.tax?.id || '',
      discount_value: data.discount_value,
      discount_type: data.discount_type,
      description: data.description,
      is_stock_tracked: data.is_stock_tracked,
      unit_conversions: data.opening_by_units,
      product_prices: data.prices,
      status: data.status,
    }

  } catch (err) {
    messageStore.showError('Failed to load row data')
  } finally {
    loading.value = false
  }
}

/* ===============================
  UPDATE TAX
================================ */
const submitUpdate = async () => {
  if (processing.value) return

  processing.value = true

  try {
    await axiosInstance.put(`/products/${rowId}`, row.value)
    messageStore.showSuccess('Row updated successfully!')
    router.push('/product')
  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Update failed')
    } else {
      messageStore.showError('Unexpected error occurred')
    }
  } finally {
    processing.value = false
  }
}



/* =====================================================
   Load Data
===================================================== */
const taxes = ref([])
const taxLoading = ref<boolean>(false);
const loadTaxes = async () => {
  loading.value = true
  taxLoading.value = true
  try {
    const res = await axiosInstance.get('/taxes/option/list')
    taxes.value = res.data.data
  } catch (err) {
    messageStore.showError('Tax load failed. Please check permission.')
  } finally {
    taxLoading.value = false
    loading.value = false
  }
}

const brands = ref([])
const brandLoading = ref<boolean>(false);
const loadBrands = async () => {
  loading.value = true
  brandLoading.value = true
  try {
    const res = await axiosInstance.get('/product-brands/option/list')
    brands.value = res.data.data
  } catch (err) {
    messageStore.showError('Brand load failed. Please check permission.')
  } finally {
    brandLoading.value = false
    loading.value = false
  }
}

const categories = ref([])
const categoryLoading = ref<boolean>(false);
const loadCategories = async () => {
  loading.value = true
  categoryLoading.value = true
  try {
    const res = await axiosInstance.get('/product-categories/option/list')
    categories.value = res.data.data
  } catch (err) {
    messageStore.showError('Category load failed. Please check permission.')
  } finally {
    categoryLoading.value = false
    loading.value = false
  }
}

const units = ref([])
const unitLoading = ref<boolean>(false);
const loadUnits = async () => {
  loading.value = true
  unitLoading.value = true
  try {
    const res = await axiosInstance.get('/product-units/option/list')
    units.value = res.data.data
  } catch (err) {
    messageStore.showError('Unit load failed. Please check permission.')
  } finally {
    unitLoading.value = false
    loading.value = false
  }
}

//load price groups
const product_prices = ref([])
const priceGroupLoading = ref<boolean>(false);
const loadPriceGroup = async () => {
  loading.value = true
  priceGroupLoading.value = true
  try {
    const res = await axiosInstance.get('/price-groups/option/list')
    product_prices.value = res.data.data
  } catch (err) {
    messageStore.showError('Price Group load failed. Please check permission.')
  } finally {
    priceGroupLoading.value = false
    loading.value = false
  }
}

/* =====================================================
   Unit Conversion per Product
===================================================== */
const addUnitRow = () => {
  row.value.unit_conversions.push({
    unit_id: '',
    multiplier: ''
  })
}

const removeUnitRow = (ucIndex) => {
  if (row.value.unit_conversions.length > 1) {
    row.value.unit_conversions.splice(ucIndex, 1)
  }
}

const isUnitDisabled = (unitId, currentUnitId) => {
  const units = row.value.unit_conversions.map(u => u.unit_id)
  if (unitId === currentUnitId) return false
  return units.includes(unitId)
}



/* =====================================================
   Price Group per Product
===================================================== */
const addPriceGroupRow = () => {
  row.value.product_prices.push({
    price_group_id: '',
    price: ''
  })
}

const removePriceGroupRow = (pgIndex) => {
  if (row.value.product_prices.length > 1) {
    row.value.product_prices.splice(pgIndex, 1)
  }
}

const isPriceGroupDisabled = (priceGroupId, currentPriceGroupId) => {
  const groups = row.value.product_prices.map(p => p.price_group_id)
  if (priceGroupId === currentPriceGroupId) return false
  return groups.includes(priceGroupId)
}



// instant parents create
import BrandCreateForm from '@/components/modals/brand/BrandCreateForm.vue'
const showBrandModal = ref(false)
const onBrandSaved = async () => {
  showBrandModal.value = false
  await loadBrands() // dropdown refresh
}

import CategoryCreateForm from '@/components/modals/category/CategoryCreateForm.vue'
const showCategoryModal = ref(false)
const onCategorySaved = async () => {
  showCategoryModal.value = false
  await loadCategories() // dropdown refresh
}

import TaxCreateForm from '@/components/modals/tax/TaxCreateForm.vue'
const showTaxModal = ref(false)
const onTaxSaved = async () => {
  showTaxModal.value = false
  await loadTaxes() // dropdown refresh
}

import PriceGroupCreateForm from '@/components/modals/priceGroup/PriceGroupCreateForm.vue'
const showPriceGroupModal = ref(false)
const onPriceGroupSaved = async () => {
  showPriceGroupModal.value = false
  await loadPriceGroup() // dropdown refresh
}

import UnitCreateForm from '@/components/modals/unit/UnitCreateForm.vue'
const showUnitModal = ref(false)
const onUnitSaved = async () => {
  showUnitModal.value = false
  await loadUnits() // dropdown refresh
}


onMounted(() => {
  loadTaxes()
  loadBrands()
  loadCategories()
  loadUnits()
  loadPriceGroup()
  fetchRow()
})

</script>

<template>
<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <ProductMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Title -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold text-gray-700">Edit Product</h2>

      <router-link
        to="/product"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        View All
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <FormSkeleton :columns="3" :rows="4" />
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="submitUpdate" class="space-y-4">

        <!-- Row 1 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div class="flex-1">
          <label class="block text-gray-600 font-medium mb-1 text-sm">
            Name <span class="text-red-600">*</span>
          </label>
          <input v-model="row.name" placeholder="Name *" class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition" />
        </div>
        <div class="flex-1">
          <label class="block text-gray-600 font-medium mb-1 text-sm">
            SKU <span class="text-red-600">*</span>
          </label>
          <input v-model="row.sku" placeholder="SKU *" class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition" />
        </div>

        <div class="flex-1">
          <label class="block text-gray-600 font-medium mb-1 text-sm">
            Brand <span class="text-red-600">*</span>
          </label>

          <div class="flex gap-2">
            <select
              v-model="row.brand_id"
              class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
              :disabled="brandLoading || !brands.length"
            >
              <option value="">Brand *</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                {{ brand.brand_name }}
              </option>
            </select>
            <button type="button"
                    @click="showBrandModal = true"
                    class="px-3 bg-blue-500 text-white rounded cursor-pointer">
              +
            </button>
          </div>

        </div>
          
          <div class="flex-1">
            <label class="block text-gray-600 font-medium mb-1 text-sm">
              Category
            </label>

              <div class="flex gap-2">
                <select
                  v-model="row.category_id"
                  class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
                  :disabled="categoryLoading || !categories.length"
                >
                  <option value="">Category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.category_name }}
                  </option>
                </select>
                <button type="button"
                        @click="showCategoryModal = true"
                        class="px-3 bg-blue-500 text-white rounded cursor-pointer">
                  +
                </button>
              </div>

          </div>

        </div>

        <!-- Row 2 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div class="flex-1">
            <label class="block text-gray-600 font-medium mb-1 text-sm">
              Cost Price
            </label>
            <input type="number" v-model="row.cost_price" placeholder="Cost Price" class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition" />
          </div>

          <div class="flex-1">
            <label class="block text-gray-600 font-medium mb-1 text-sm">
              Sold Price
            </label>
           <input type="number" v-model="row.selling_price" placeholder="Sold Price" class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition" />
          </div>

          <div class="flex-1">
            <label class="block text-gray-600 font-medium mb-1 text-sm">
              TAX
            </label>

            <div class="flex gap-2">
              <select
                  v-model="row.tax_id"
                  class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
                  :disabled="taxLoading || !taxes.length"
                >
                  <option value="">TAX</option>
                  <option v-for="tax in taxes" :key="tax.id" :value="tax.id">
                    {{ tax.tax_name }}
                  </option>
                </select>
                <button type="button"
                        @click="showTaxModal = true"
                        class="px-3 bg-blue-500 text-white rounded cursor-pointer">
                  +
                </button>
              </div>
            </div>

            <div class="flex-1">
              <label class="block text-gray-600 font-medium mb-1 text-sm">
                Discount
              </label>
              <input type="number" v-model="row.discount_value" placeholder="Discount" class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition" />
            </div>
        </div>

        <!-- Row 3 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div class="flex-1">
            <label class="block text-gray-600 font-medium mb-1 text-sm">
              Discount Type
            </label>
            <select v-model="row.discount_type" class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition">
              <option value="">Select</option>
              <option value="flat">Flat</option>
              <option value="percent">Percent</option>
            </select>
          </div>

          <div class="flex-1">
            <label class="block text-gray-600 font-medium mb-1 text-sm">
              Description
            </label>
            <textarea
              v-model="row.description"
              placeholder="Description"
              rows="1"
              class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition"></textarea>
            </div>

          <div class="flex-1">
            <label class="block text-gray-600 font-medium mb-1 text-sm">
              Status <span class="text-red-600">*</span>
            </label>
            <select v-model="row.status" class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition">
              <option value="">Status *</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div class="flex-1">
          <label class="block text-gray-600 font-medium mb-1 text-sm">
            Stock Tracked? <span class="text-red-600">*</span>
          </label>
            <select v-model="row.is_stock_tracked" class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition">
              <option value="">Stock Tracked? *</option>
              <option :value="1">Yes</option>
              <option :value="0">No</option>
            </select>
          </div>

        </div>

        <div class="mt-10 border border-gray-200 rounded-2xl bg-white shadow-sm">
          <div class="px-6 py-4 border-b">
            <h3 class="text-base font-semibold text-gray-800">
              Unit Conversion <span class="text-red-500">*</span>
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              Define alternative units and their conversion rate
            </p>
          </div>

          <div class="p-6 space-y-4">
            <div
              v-for="(uc, ucIndex) in row.unit_conversions"
              :key="ucIndex"
              class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
            >

              <div class="flex gap-2">
                <select
                  v-model="uc.unit_id"
                  class="w-full rounded-lg border-gray-300 px-4 py-2.5 text-sm
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="">Select Unit *</option>
                  <option
                    v-for="unit in units"
                    :key="unit.id"
                    :value="unit.id"
                    :disabled="isUnitDisabled(unit.id, uc.unit_id)"
                  >
                    {{ unit.unit_name }}
                  </option>
                </select>
                <button type="button"
                        @click="showUnitModal = true"
                        class="px-3 bg-blue-500 text-white rounded cursor-pointer">
                  +
                </button>
              </div>

              <input
                v-model="uc.multiplier"
                type="number"
                placeholder="Multiplier (e.g. 0.5, 2)"
                class="w-full rounded-lg border-gray-300 px-4 py-2.5 text-sm
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />

              <input
                v-model="uc.opening"
                type="number"
                placeholder="Opening Qty"
                class="w-full rounded-lg border-gray-300 px-4 py-2.5 text-sm
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="addUnitRow(index)"
                  v-if="ucIndex === row.unit_conversions.length - 1"
                  class="px-4 py-2 text-sm font-medium rounded-lg
                         bg-emerald-500 hover:bg-emerald-600 text-white
                         transition cursor-pointer"
                >
                  Add
                </button>

                <button
                  type="button"
                  @click="removeUnitRow(ucIndex)"
                  :disabled="row.unit_conversions.length === 1"
                  class="px-4 py-2 text-sm font-medium rounded-lg
                         bg-rose-500 hover:bg-rose-600 text-white
                         transition cursor-pointer
                         disabled:opacity-40 disabled:cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-10 border border-gray-200 rounded-2xl bg-white shadow-sm">
          <div class="px-6 py-4 border-b">
            <h3 class="text-base font-semibold text-gray-800">Price Group</h3>
            <p class="text-sm text-gray-500 mt-1">
              Set pricing based on customer groups
            </p>
          </div>

          <div class="p-6 space-y-4">
            <div
              v-for="(pg, pgIndex) in row.product_prices"
              :key="pgIndex"
              class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
            >

              <div class="flex gap-2">
                <select
                  v-model="pg.price_group_id"
                  class="w-full rounded-lg border-gray-300 px-4 py-2.5 text-sm
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="">Select Price Group</option>
                  <option
                    v-for="price_group in product_prices"
                    :key="price_group.id"
                    :value="price_group.id"
                    :disabled="isPriceGroupDisabled(price_group.id, pg.price_group_id)"
                  >
                    {{ price_group.group_name }}
                  </option>
                </select>
                <button type="button"
                        @click="showPriceGroupModal = true"
                        class="px-3 bg-blue-500 text-white rounded cursor-pointer">
                  +
                </button>
              </div>

              <input
                v-model="pg.price"
                type="number"
                placeholder="Price"
                class="w-full rounded-lg border-gray-300 px-4 py-2.5 text-sm
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="addPriceGroupRow()"
                  v-if="pgIndex === row.product_prices.length - 1"
                  class="px-4 py-2 text-sm font-medium rounded-lg
                         bg-emerald-500 hover:bg-emerald-600 text-white
                         transition cursor-pointer"
                >
                  Add
                </button>

                <button
                  type="button"
                  @click="removePriceGroupRow(pgIndex)"
                  :disabled="row.product_prices.length === 1"
                  class="px-4 py-2 text-sm font-medium rounded-lg
                         bg-rose-500 hover:bg-rose-600 text-white
                         transition cursor-pointer
                         disabled:opacity-40 disabled:cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

      <button
        type="submit"
        :disabled="processing"
        class="w-full bg-gray-500 text-white font-semibold p-3 rounded
               hover:bg-gray-600 transition cursor-pointer
               disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ processing ? 'Updating...' : 'Update Product' }}
      </button>

    </form>

  </div>

    <!-- modals -->
  <!-- brand modal -->
  <div v-if="showBrandModal"
     class="fixed inset-0 bg-black/50 flex items-center justify-center z-100">

    <div class="bg-white w-full max-w-xl rounded-xl p-6">

      <h3 class="text-lg font-semibold mb-4">Add New Brand</h3>

      <BrandCreateForm
        @saved="onBrandSaved"
        @cancel="showBrandModal = false"
      />

    </div>
  </div>
  <!-- category modal -->
  <div v-if="showCategoryModal"
     class="fixed inset-0 bg-black/50 flex items-center justify-center z-100">

    <div class="bg-white w-full max-w-xl rounded-xl p-6">

      <h3 class="text-lg font-semibold mb-4">Add New Category</h3>

      <CategoryCreateForm
        @saved="onCategorySaved"
        @cancel="showCategoryModal = false"
      />

    </div>
  </div>
  <!-- Tax modal -->
  <div v-if="showTaxModal"
     class="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
    <div class="bg-white w-full max-w-xl rounded-xl p-6">
      <h3 class="text-lg font-semibold mb-4">Add New Tax</h3>
      <TaxCreateForm
        @saved="onTaxSaved"
        @cancel="showTaxModal = false"
      />
    </div>
  </div>

  <!-- Price Group modal -->
  <div v-if="showPriceGroupModal"
     class="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
    <div class="bg-white w-full max-w-xl rounded-xl p-6">
      <h3 class="text-lg font-semibold mb-4">Add New Price Group</h3>
      <PriceGroupCreateForm
        @saved="onPriceGroupSaved"
        @cancel="showPriceGroupModal = false"
      />
    </div>
  </div>

  <!-- Unit modal -->
  <div v-if="showUnitModal"
     class="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
    <div class="bg-white w-full max-w-xl rounded-xl p-6">
      <h3 class="text-lg font-semibold mb-4">Add New Unit</h3>
      <UnitCreateForm
        @saved="onUnitSaved"
        @cancel="showUnitModal = false"
      />
    </div>
  </div>

</div>
</template>
