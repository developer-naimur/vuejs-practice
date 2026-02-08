<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

import FormSkeleton from '@/components/Skeleton/Form-1.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import StockMenu from '@/components/inc/SubSidebar/StockMenu.vue'

import PurchaseSummary from '@/components/PurchaseSummary.vue'
import { useMessageStore } from '@/stores/useMessageStore'

const messageStore = useMessageStore()
const route = useRoute()
const router = useRouter()

const rounded = (val: number) => Math.round(val * 10000) / 10000;

const rowId = ref(route.params.id)

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Operations', to: '/stock/operation' },
  { label: 'Edit Operation' }
]

const processing = ref(false)
const loading = ref(true)

/* =====================================================
   Product Popup Shared State
===================================================== */
import { useProductPopupStore } from '@/composables/useProductPopupStore'
const productPopup = useProductPopupStore()
const selectedProducts = computed(() => productPopup.selectedProducts)
const updateQty = productPopup.updateQty
const removeProduct = productPopup.removeProduct
const openProductPopup = () => {
  productPopup.openPopup()
}

/* ===============================
  SINGLE ROW STATE
================================ */
const row = ref({})

/* ===============================
  FETCH TAX DATA
================================ */
const fetchRow = async () => {
  loading.value = true
  try {
    const res = await axiosInstance.get(`/stock-adjustments/${rowId.value}`)
    const data = res.data.data


    // Main row fields
    row.value = {
      operation_date: data.date,
      operation_type: data.operation_type,
      direction: data.direction,
      party_type: data.party_type,
      customer_id: data.customer?.id || '',
      supplier_id: data.supplier?.id || '',
      status: data.status,
      note: data.note,
      adjustable_type: '',
      adjustable_id: 0,
      payment_amount: Number(data.payment_amount) > 0 ? data.payment_amount : '',
      account_id: data.account_id ? data.account_id : '',
      payment_note: data.payment_note,
    }

    if (data.adjustable_type === 'Purchase' && data.adjustable_id) {
      fetchPurchaseSummary(data.adjustable.uuid)
      row.value.adjustable_type = 'Purchase'
      row.value.adjustable_id = data.adjustable_id
    }


    // Load selected products into Pinia store
    productPopup.selectedProducts.splice(0, productPopup.selectedProducts.length) // clear old
    data.details?.forEach((d: any) => {
      productPopup.selectedProducts.push({
        id: d.product_id,
        name: d.product?.name || '',
        qty: Number(d.quantity),
        cost_price: Number(d.cost_price),
        sale_price: Number(d.sale_price),
        note: d.note,
      })
    })

  } catch (err) {
    messageStore.showError('Failed to load row data')
  } finally {
    loading.value = false
  }
}


//get purchase summery
const purchaseId = ref(0)
const purchase = ref<any>(null)
const purchaseLoading = ref(false)
const fetchPurchaseSummary = async (uuid: string) => {
  loading.value = true
  purchaseLoading.value = true
  try {
    const res = await axiosInstance.get(`/purchases/${uuid}`)
    const data = res.data.data
    purchaseId.value = data.uuid
    purchase.value = data
  } catch (err) {
    messageStore.showError('Failed to load purchase summary.')
  } finally {
    loading.value = false
    purchaseLoading.value = false
  }
}


/* ===============================
  UPDATE
================================ */
const submitUpdate = async () => {
  if (processing.value) return

  processing.value = true

  try {

    const res = await axiosInstance.put(`/stock-adjustments/${rowId.value}`, {
      ...row.value,
      details: selectedProducts.value.map(p => ({
        product_id: p.id,
        cost_price: p.cost_price,
        sale_price: p.sale_price,
        quantity: p.qty,
      })),
    })

    messageStore.showSuccess('Row updated successfully!')

    const nextUuid = res.data.next_stock_adjustment_uuid
    if (nextUuid) {
      rowId.value = nextUuid      // update ref
      await fetchRow()            // reload data for new rowId
      router.push(`/stock/operation/${nextUuid}/edit`) // optional, URL update
    } else {
      router.push('/stock/operation')
    }

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

//load accounts
const accounts = ref([])
const accountLoading = ref<boolean>(false);
const loadAccounts = async () => {
  loading.value = true
  accountLoading.value = true
  try {
    const res = await axiosInstance.get('/accounts/option/list')
    accounts.value = res.data.data
  } catch (err) {
    messageStore.showError('Account load failed. Please check permission.')
  } finally {
    accountLoading.value = false
    loading.value = false
  }
}

//load customers
const customers = ref([])
const customerLoading = ref<boolean>(false);
const loadCustomers = async () => {
  loading.value = true
  customerLoading.value = true
  try {
    const res = await axiosInstance.get('/customers/option/list')
    customers.value = res.data.data
  } catch (err) {
    messageStore.showError('Customer load failed. Please check permission.')
  } finally {
    customerLoading.value = false
    loading.value = false
  }
}
//load suppliers
const suppliers = ref([])
const supplierLoading = ref<boolean>(false);
const loadSuppliers = async () => {
  loading.value = true
  supplierLoading.value = true
  try {
    const res = await axiosInstance.get('/suppliers/option/list')
    suppliers.value = res.data.data
  } catch (err) {
    messageStore.showError('Supplier load failed. Please check permission.')
  } finally {
    supplierLoading.value = false
    loading.value = false
  }
}

onMounted(() => {
  loadAccounts()
  loadCustomers()
  loadSuppliers()
  fetchRow()
})

watch(
  () => row.value.party_type,
  (partyType) => {
    if (partyType === 'customer') {
      row.value.supplier_id = ''
      row.value.payment_type = 'receive'
    } else if (partyType === 'supplier') {
      row.value.customer_id = ''
      row.value.payment_type = 'payment'
    } else {
      row.value.customer_id = ''
      row.value.supplier_id = ''
      row.value.payment_type = ''
    }
  }
)

const showCostPrice = computed(() => {
  if (row.value.operation_type === 'free') return false
  return row.value.party_type === 'supplier'
})

const showSalePrice = computed(() => {
  if (row.value.operation_type === 'free') return false
  return row.value.party_type === 'customer'
})


/* ================= GRAND TOTAL ================= */
const productSubtotal = (p) => {
  if (!p) return 0

  const qty = Number(p.qty) || 0
  let price = 0
  if(showCostPrice.value){
    price = Number(p.cost_price) || 0
  }
  else if(showSalePrice.value){
    price = Number(p.sale_price) || 0
  }
  else{
    price = 0
  }
   
  const base = rounded(qty * price)

  return rounded(base)
}

const netAdjustment = computed(() =>
  selectedProducts.value.reduce((sum, p) => sum + productSubtotal(p), 0)
)


</script>

<template>
<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <StockMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />


    <PurchaseSummary
    :purchase-id="purchaseId"
    :purchase="purchase"
    :loading="purchaseLoading"
  />

    <!-- Title -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold text-gray-700">Edit Operation</h2>

      <router-link
          to="/stock/operation"
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

      <!-- ================= OPERATION INFO ================= -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 p-4 bg-white">

      <!-- Operation Date -->
      <div>
        <label class="block text-sm text-gray-600 mb-1">Operation Date <span class="text-red-600">*</span></label>
        <input type="date" v-model="row.operation_date"
               class="w-full border p-2 focus:ring-2 focus:ring-gray-500" />
      </div>

      <!-- Operation Type -->
      <div>

        <label class="block text-sm text-gray-600 mb-1">Operation Type <span class="text-red-600">*</span></label>

        <select v-model="row.operation_type"
                class="w-full border p-2 focus:ring-2 focus:ring-gray-500">
          <option value="">Select</option>
          <option value="adjustment">Adjustment</option>
          <option value="damage">Damage</option>
          <option value="free">Free</option>
          <option value="return">Return</option>
          <option value="lost">Lost</option>

        </select>
      </div>

      <!-- Direction -->
      <div>
        <label class="block text-sm text-gray-600 mb-1">Direction <span class="text-red-600">*</span></label>
        <select v-model="row.direction"
                class="w-full border p-2 focus:ring-2 focus:ring-gray-500">
          <option value="">Select</option>
          <option value="in">In</option>
          <option value="out">Out</option>
        </select>
      </div>

      <!-- Party Type -->
      <div>
          <label class="block text-sm text-gray-600 mb-1">
            Party Type <span class="text-red-600">*</span>
          </label>
          <select
            v-model="row.party_type"
            class="w-full border p-3"
          >
            <option value="">Party Type</option>
            <option value="customer">Customer</option>
            <option value="supplier">Supplier</option>
            <option value="none">None</option>
          </select>
        </div>

        <div
          class="relative group"
          :title="row.party_type !== 'customer'
            ? 'Please select Party Type: Customer'
            : ''"
        >
          <label
            class="block text-sm mb-1"
            :class="row.party_type !== 'customer'
              ? 'text-gray-400'
              : 'text-gray-600'"
          >
            Customer <span class="text-red-600">*</span>
          </label>

          <select
            v-model="row.customer_id"
            class="w-full border p-3 transition
                   disabled:bg-gray-100 disabled:text-gray-400
                   disabled:cursor-not-allowed"
            :disabled="row.party_type !== 'customer' || customerLoading || !customers.length"
          >
            <option value="">Select</option>
            <option
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.name }}
              <template v-if="customer.phone"> - {{ customer.phone }}</template>
            </option>
          </select>
        </div>

        <div
          class="relative group"
          :title="row.party_type !== 'supplier'
            ? 'Please select Party Type: Supplier'
            : ''"
        >
          <label
            class="block text-sm mb-1"
            :class="row.party_type !== 'supplier'
              ? 'text-gray-400'
              : 'text-gray-600'"
          >
            Supplier <span class="text-red-600">*</span>
          </label>

          <select
            v-model="row.supplier_id"
            class="w-full border p-3 transition
                   disabled:bg-gray-100 disabled:text-gray-400
                   disabled:cursor-not-allowed"
            :disabled="row.party_type !== 'supplier' || supplierLoading || !suppliers.length"
          >
            <option value="">Select</option>
            <option
              v-for="supplier in suppliers"
              :key="supplier.id"
              :value="supplier.id"
            >
              {{ supplier.name }}
              <template v-if="supplier.phone"> - {{ supplier.phone }}</template>
            </option>
          </select>
        </div>

    </div>


      <!-- Get Products Button -->
      <button
        type="button"
        @click="openProductPopup"
        class="text-2xl w-full bg-yellow-500 text-white font-semibold p-4 hover:bg-yellow-600 transition cursor-pointer"
      >
        Get Products
      </button>

      <!-- Selected Products Table -->
      <div v-if="selectedProducts.length" class="border border-gray-200 p-4 bg-white space-y-4 mb-0">
        <h3 class="text-lg font-semibold text-gray-700">Selected Products <span class="text-red-600">*</span></h3>
        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">Product</th>
                <th class="px-4 py-2 text-center">Qty</th>
                  <th class="px-4 py-2 text-left" v-if="showCostPrice">Cost Price</th>
                  <th class="px-4 py-2 text-left" v-if="showSalePrice">Sale Price</th>
                <th class="px-4 py-2 text-left">Remove</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">

              <tr v-for="p in selectedProducts" :key="p.id" class="hover:bg-gray-50">
                <td class="px-4 py-2">{{ p.name }}</td>
                <td class="px-4 py-2 text-center">
                  <div class="flex justify-center">
                    <div class="flex border rounded overflow-hidden">
                      <!-- Minus Button -->
                      <button
                        type="button"
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
                        type="button"
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
                  <td v-if="showCostPrice" class="px-4 py-2">
                    <input
                      type="number"
                      v-model.number="p.cost_price"
                      min="0"
                      step="0.0001"
                      class="w-20 border p-1 focus:ring-2 focus:ring-gray-500"
                    />
                  </td>
                  <td v-if="showSalePrice" class="px-4 py-2">
                    <input
                      type="number"
                      v-model.number="p.sale_price"
                      min="0"
                      step="0.0001"
                      class="w-20 border p-1 focus:ring-2 focus:ring-gray-500"
                    />
                  </td>
                <td class="px-4 py-2 text-center">
                  <button @click="removeProduct(p)" class="text-red-600 cursor-pointer">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      <!-- Total Section -->
      <template v-if="showCostPrice || showSalePrice">
        <div class="border border-gray-200 p-4 bg-gray-50 space-y-3 mb-0">
          <div class="flex justify-between text-lg font-bold ">
            <span>Total</span>
            <span>৳ {{ netAdjustment }}</span>
          </div>
        </div>
      </template>

      <!-- Note -->
      <div class="border border-gray-200 p-4 mb-0">
        <label class="block text-sm text-gray-600 mb-1">Note</label>
        <textarea v-model="row.note" class="w-full border p-2 focus:ring-2 focus:ring-gray-500" rows="3" placeholder="note..."></textarea>
      </div>

      <!-- Payment Section -->
      <template v-if="showCostPrice || showSalePrice">
        <div class="border border-gray-200 p-4 space-y-3 mb">
          <div>
            <label class="block font-medium mb-1">Payment Amount</label>
            <input v-model="row.payment_amount" type="number" min="0" step="0.0001" 
              class="w-full border p-2 focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label class="block font-medium mb-1">Payment Method</label>
            <select
              v-model="row.account_id"
              class="w-full border p-2 focus:ring-2 focus:ring-gray-500"
              :disabled="accountLoading || !accounts.length"
            >
              <option value="">Select</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.account_name }} <template v-if="account.account_number"> - {{ account.account_number }}</template>
              </option>
            </select>
          </div>
          <div>
            <label class="block font-medium mb-1">Payment Note</label>
            <textarea v-model="row.payment_note" class="w-full border p-2 focus:ring-2 focus:ring-gray-500" rows="2" placeholder="Payment note..."></textarea>
          </div>
        </div>
      </template>

      <!-- Status -->
      <div class="border border-gray-200 p-4 mb-0">
        <label class="block text-sm text-gray-600 mb-1">Status <span class="text-red-600">*</span></label>
        <select v-model="row.status"
                class="w-full border p-2 focus:ring-2 focus:ring-gray-500">
          <option value="">Select</option>
          <option value="pending">Pending</option>
          <option value="approved">Approve</option>
          <option value="cancelled">Cancel</option>
        </select>
      </div>

      <button
        type="submit"
        :disabled="processing"
        class="w-full bg-gray-500 text-white font-semibold p-3 rounded
               hover:bg-gray-600 transition cursor-pointer
               disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ processing ? 'Updating...' : 'Update ' + row.operation_type }}
      </button>

    </form>

  </div>
</div>
</template>
