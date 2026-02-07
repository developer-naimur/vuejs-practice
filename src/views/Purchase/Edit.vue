<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

import TableSkeleton from '@/components/Skeleton/Table.vue'
import PurchaseMenu from '@/components/inc/SubSidebar/PurchaseMenu.vue'
import FormSkeleton from '@/components/skeleton/Form-2.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import SupplierList from '@/components/modals/supplier/SupplierList.vue'

import { $routes, $labels } from '@/constants/purchase'
import { useMessageStore } from '@/stores/useMessageStore'
import { useProductPopupStore } from '@/composables/useProductPopupStore'


const rounded = (val: number) => Math.round(val * 10000) / 10000;

/* ================= BASIC ================= */
const router = useRouter()
const route  = useRoute()
const messageStore = useMessageStore()
const productPopup = useProductPopupStore()

const processing = ref(false)
const loading = ref(true)

/* ================= UUID ================= */
const rowId = route.params.id

/* ================= BREADCRUMB ================= */
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: $labels.plural_name, to: $routes.index },
  { label: 'Edit ' + $labels.singular_name }
]

/* ================= HELPERS ================= */
const getToday = () => new Date().toISOString().slice(0, 10)

/* ================= FORM STATE ================= */
const date = ref(getToday())
const invoiceNote = ref('')
const paymentAmount = ref(0)
const accountId = ref('')
const paymentNote = ref('')
const grandTax = ref(0)
const grandDiscount = ref(0)
const grandDiscountType = ref('percent')
const status = ref('pending')

/* ================= SUPPLIER ================= */
const supplier = ref<any>(null)
const showSupplierModal = ref(false)

const openSupplierModal = () => {
  showSupplierModal.value = true
}

const onSupplierSelected = (s: any) => {
  supplier.value = s
  showSupplierModal.value = false
}

/* ================= PRODUCTS ================= */
const selectedProducts = computed(() => productPopup.selectedProducts)
const updateQty = productPopup.updateQty
const removeProduct = productPopup.removeProduct
const openProductPopup = () => productPopup.openPopup()

/* ================= CALCULATION ================= */
const productSubtotal = (p: any) => {
  const qty = Number(p.qty) || 0
  const price = Number(p.cost_price) || 0
  const base = rounded(qty * price)

  const tax = rounded(base * (Number(p.tax?.tax_value) || 0) / 100)

  let discount = 0
  if (p.discount_type === 'percent') {
    discount = rounded(base * (Number(p.discount_value) || 0) / 100)
  } else if (p.discount_type === 'flat') {
    discount = Number(p.discount_value) || 0
  }

  return rounded(base + tax - discount)
}

const grandSubTotal = computed(() =>
  selectedProducts.value.reduce((s, p) => s + productSubtotal(p), 0)
)

const grandTaxAmount = computed(() =>
  rounded(grandSubTotal.value * grandTax.value / 100)
)

const grandDiscountAmount = computed(() =>
  grandDiscountType.value === 'percent'
    ? rounded(grandSubTotal.value * grandDiscount.value / 100)
    : rounded(grandDiscount.value)
)

const netBeforeAdjustment = computed(() =>
  rounded(grandSubTotal.value
  + grandTaxAmount.value
  - grandDiscountAmount.value)
)


/* =====================================================
   Adjustments
===================================================== */
const adjustments = ref<any>([])

const addAdjustment = () => {
  adjustments.value.push({
    adjustment_head_id: '',
    type: 'add',
    value_type: 'flat',
    value: 0,
    note: '',
  })
}
const removeAdjustment = (index: number) => {
  adjustments.value.splice(index, 1)
}

const adjustmentTotal = computed(() => {
  return rounded(adjustments.value.reduce((sum, a) => {
    let amount = 0
    if (a.value_type === 'percent') {
      amount = rounded(netBeforeAdjustment.value * a.value / 100)
    } else {
      amount = rounded(Number(a.value) || 0)
    }
    return a.type === 'add' ? rounded(sum + amount) : rounded(sum - amount)
  }, 0))
})

const netTotal = computed(() =>
  rounded(netBeforeAdjustment.value + adjustmentTotal.value)
)

/* ================= ACCOUNTS ================= */
const accounts = ref<any[]>([])
const accountLoading = ref(false)

const loadAccounts = async () => {
  accountLoading.value = true
  try {
    const res = await axiosInstance.get('/accounts/option/list')
    accounts.value = res.data.data
  } catch {
    messageStore.showError('Account load failed')
  } finally {
    accountLoading.value = false
  }
}


//load adjustment head
const adjustmentHeads = ref([])
const adjustmentHeadLoading = ref<boolean>(false);
const loadadjustmentHeads = async () => {
  loading.value = true
  adjustmentHeadLoading.value = true
  try {
    const res = await axiosInstance.get('/adjustment-heads/option/list')
    adjustmentHeads.value = res.data.data
  } catch (err) {
    messageStore.showError('Account load failed. Please check permission.')
  } finally {
    adjustmentHeadLoading.value = false
    loading.value = false
  }
}


/* ================= FETCH PURCHASE ================= */
const fetchPurchase = async () => {
  loading.value = true
  try {
    const res = await axiosInstance.get(`/purchases/${rowId}`)
    const p = res.data.data


    /* ===== BASIC INFO ===== */
    date.value        = p.date
    invoiceNote.value = p.description ?? ''
    status.value      = p.status ?? 'pending'

    /* ===== DISCOUNT ===== */
    grandDiscount.value = p.discount?.value ?? 0
    grandDiscountType.value = p.discount?.type ?? 'percent'

    /* ===== TAX ===== */
    grandTax.value = p.tax?.value ?? 0

    /* ===== PAYMENT ===== */
    if (p.purchase_payment) {
      paymentAmount.value = p.purchase_payment.credit ?? 0
      accountId.value = p.purchase_payment.account_id ?? ''
      paymentNote.value = p.purchase_payment.note ?? ''
    }


    /* ===== SUPPLIER ===== */
    supplier.value = p.supplier



    /* ===== PRODUCTS ===== */
    productPopup.selectedProducts = p.details.map((d: any) => ({
      id: d.product?.id,
      name: d.product?.name,
      sku: d.product?.sku,
      qty: d.quantity,
      cost_price: d.unit_price,

      discount_value: d.discount?.value ?? 0,
      discount_type: d.discount?.type ?? 'percent',

      tax: {
        tax_value: d.tax?.tax_rate ?? 0
      }
    }))
    /* ===== ADJUSTMENTS ===== */
    adjustments.value = p.adjustments.map((a: any) => ({
      id: a.id,
      adjustment_head_id: a.head.id,
      type: a.type,
      value_type: a.value_type,
      value: a.value,
      note: a.note,

    }))

  } catch (error) {
    messageStore.showError('Failed to load purchase')
    // router.push($routes.index)
  } finally {
    loading.value = false
  }
}


/* ================= UPDATE ================= */
const submitRows = async () => {
  if (processing.value) return

  if (!selectedProducts.value.length) {
    messageStore.showError('Please select at least one product.')
    return
  }

  processing.value = true

  try {
    const res = await axiosInstance.put(`/purchases/${rowId}`, {
      purchase_date: date.value,
      supplier_id: supplier.value?.id,
      note: invoiceNote.value,
      tax_rate: grandTax.value,
      discount_value: grandDiscount.value,
      discount_type: grandDiscountType.value,
      paid_amount: paymentAmount.value,
      account_id: accountId.value,
      payment_note: paymentNote.value,
      status: status.value,

      details: selectedProducts.value.map(p => ({
        product_id: p.id,
        quantity: p.qty,
        unit_price: p.cost_price,
        tax_rate: p.tax?.tax_value || 0,
        discount_value: p.discount_value || 0,
        discount_type: p.discount_type || 'percent',
      })),

      adjustments: adjustments.value.map(a => ({
        adjustment_head_id: a.adjustment_head_id,
        type: a.type,
        value_type: a.value_type,
        value: a.value,
        note: a.note,
      })),

    })

    messageStore.showSuccess('Purchase updated successfully!')
    productPopup.selectedProducts = []

     // Redirect to first stock adjustment edit if exists
    const updatedPurchase = res.data.data
    if (updatedPurchase.stock_adjustments && updatedPurchase.stock_adjustments.length) {
      const firstStock = updatedPurchase.stock_adjustments[0]
      router.push(`/stock/operation/${firstStock.uuid}/edit`)
    } else {
      router.push($routes.index)
    }

  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Update failed')
    } else {
      messageStore.showError('Unexpected error')
    }
  } finally {
    processing.value = false
  }
}

/* ================= INIT ================= */
onMounted(async () => {
  await loadAccounts()
  await loadadjustmentHeads()
  await fetchPurchase()
})
</script>

<template>
  <div class="flex gap-4">

    <div class="hidden lg:block flex-none">
      <PurchaseMenu />
    </div>

    <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

      <Breadcrumb :items="breadcrumbs" />

      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-700">
          Edit {{ $labels.singular_name }}
        </h2>
      </div>

      <div v-if="loading" class="space-y-4">
        <FormSkeleton :columns="3" :rows="4" />
      </div>

      <form v-else @submit.prevent="submitRows" class="space-y-4">

        <!-- ================= SUPPLIER INFO ================= -->
        <div v-if="supplier" class="border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-700">
              Supplier Information
            </h3>
            <button
              type="button"
              @click="openSupplierModal"
              class="px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Change
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <p><strong>Name:</strong> {{ supplier.name }}</p>
            <p><strong>Phone:</strong> {{ supplier.phone }}</p>
            <p class="md:col-span-2">
              <strong>Address:</strong> {{ supplier.address }}
            </p>
          </div>
        </div>

        <SupplierList v-model="showSupplierModal" @selected="onSupplierSelected" />

        <!-- ================= PRODUCTS ================= -->
        <button
          type="button"
          @click="openProductPopup"
          class="text-2xl w-full bg-yellow-500 text-white font-semibold p-4"
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
                <th class="px-4 py-2 text-left">Price</th>
                <th class="px-4 py-2 text-left">Tax %</th>
                <th class="px-4 py-2 text-left">Discount</th>
                <th class="px-4 py-2 text-left">Type</th>
                <th class="px-4 py-2 text-right">Subtotal</th>
                <th class="px-4 py-2 text-left">Remove</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">

              <tr v-for="p in selectedProducts" :key="p.id" class="hover:bg-gray-50">
                <td class="px-4 py-2">{{ p.name }} - {{ p.sku }}</td>
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
                        step="0.0001"
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
                <td class="px-4 py-2">
                  <input type="number" min="0" step="0.0001" v-model.number="p.cost_price" class="w-20 border p-1 focus:ring-2 focus:ring-gray-500" />
                </td>
                <td class="px-4 py-2">
                  <input type="number" min="0" step="0.0001" v-model.number="p.tax.tax_value" class="w-16 border p-1 focus:ring-2 focus:ring-gray-500" />
                </td>
                <td class="px-4 py-2">
                  <input type="number" min="0" step="0.0001" v-model.number="p.discount_value" class="w-16 border p-1 focus:ring-2 focus:ring-gray-500" />
                </td>
                <td class="px-4 py-2">
                  <select v-model="p.discount_type" class="border p-1 focus:ring-2 focus:ring-gray-500">
                    <option value="">Select</option>
                    <option value="flat">Flat</option>
                    <option value="percent">Percent</option>
                  </select>
                </td>
                <td class="px-4 py-2 font-semibold text-right">৳ {{ productSubtotal(p) }}</td>
                <td class="px-4 py-2 text-center">
                  <button type="button" @click="removeProduct(p)" class="text-red-600 cursor-pointer">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Grand Total Section -->
      <div class="border border-gray-200 p-4 bg-gray-50 space-y-3 mb-0">
        <div class="flex justify-between"><span>Subtotal</span><strong>৳ {{ grandSubTotal }}</strong></div>
        <div class="flex gap-2 items-center">
          <span>Tax %</span>
          <input type="number" min="0" step="0.0001" v-model.number="grandTax" class="w-20 border p-1 focus:ring-2 focus:ring-gray-500" />
          <span>৳ {{ grandTaxAmount }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <span>Discount</span>
          <input type="number" min="0" step="0.0001" v-model.number="grandDiscount" class="w-20 border p-1 focus:ring-2 focus:ring-gray-500" />
          <select v-model="grandDiscountType" class="border p-1 focus:ring-2 focus:ring-gray-500">
            <option value="">Select</option>
            <option value="flat">Flat</option>
            <option value="percent">Percent</option>
          </select>
          <span>৳ {{ grandDiscountAmount }}</span>
        </div>

        <div class="border-t pt-2">

          <div class="flex justify-between text-lg font-bold ">
            <span>Grand Total</span>
            <span>৳ {{ netBeforeAdjustment }}</span>
          </div>

          <!-- ================= Adjustments ================= -->
          <div class="border border-gray-200 p-4 bg-white space-y-3">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-700">Adjustments</h3>

              <button
                type="button"
                @click="addAdjustment"
                class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + Add Adjustment
              </button>
            </div>

            <div
              v-for="(adj, index) in adjustments"
              :key="index"
              class="grid grid-cols-12 gap-2 items-center"
            >
              <!-- Adjustment Head -->
              <select
                v-model="adj.adjustment_head_id"
                class="col-span-3 border p-2"
                :disabled="adjustmentHeadLoading || !adjustmentHeads.length"
              >
                <option value="">Select Head</option>
                <option v-for="h in adjustmentHeads" :value="h.id">{{ h.head_name }}</option>
              </select>

              <!-- Type -->
              <select
                v-model="adj.type"
                class="col-span-2 border p-2"
              >
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
              </select>

              <select v-model="adj.value_type" class="border p-2">
                <option value="flat">Flat</option>
                <option value="percent">Percent (%)</option>
              </select>

              <input
                type="number"
                min="0" step="0.0001"
                v-model.number="adj.value"
                class="border p-2"
                :placeholder="adj.value_type === 'percent' ? '%' : 'Amount'"
              />

              <!-- Note -->
              <input
                type="text"
                v-model="adj.note"
                class="col-span-3 border p-2"
                placeholder="Note"
              />

              <!-- Remove -->
              <button
                type="button"
                @click="removeAdjustment(index)"
                class="col-span-1 text-red-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div class="flex justify-between font-semibold border-t pt-2">
              <span>Adjustment Total</span>
              <span>৳ {{ adjustmentTotal }}</span>
            </div>
          </div>
          <!-- end other adjustments -->

          <div class="flex justify-between text-lg font-bold ">
            <span>Net Total</span>
            <span>৳ {{ netTotal }}</span>
          </div>
        </div>

      </div>

      <!-- Invoice Note -->
      <div class="border border-gray-200 p-4 mb-0">
        <label class="block font-medium mb-1">Invoice Note</label>
        <textarea v-model="invoiceNote" class="w-full border p-2 focus:ring-2 focus:ring-gray-500" rows="3" placeholder="Invoice note..."></textarea>
      </div>

      <!-- Payment Section -->
      <div class="border border-gray-200 p-4 space-y-3 mb">
        <div>
          <label class="block font-medium mb-1">Payment Amount</label>
          <input v-model="paymentAmount" type="number" min="0" step="0.0001" 
            class="w-full border p-2 focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <div>
          <label class="block font-medium mb-1">Payment Method</label>
          <select
            v-model="accountId"
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
          <textarea v-model="paymentNote" class="w-full border p-2 focus:ring-2 focus:ring-gray-500" rows="2" placeholder="Payment note..."></textarea>
        </div>

        <div>
          <label class="block font-medium mb-1">Status <span class="text-red-600">*</span></label>
          <select
            v-model="status"
            class="w-full border p-2 focus:ring-2 focus:ring-gray-500"
          >
            <option value="">Select</option>
            <option value="pending">Pending</option>
            <option value="approved">Approve</option>
            <option value="cancelled">Cancel</option>
          </select>
        </div>
      </div>

        <!-- ================= SUBMIT ================= -->
        <button
          type="submit"
          :disabled="processing"
          class="w-full bg-gray-500 text-white font-semibold p-3 disabled:opacity-50"
        >
          {{ processing ? 'Processing...' : 'Update' }}
        </button>

      </form>
    </div>
  </div>
</template>
