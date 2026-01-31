<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

import TableSkeleton from '@/components/Skeleton/Table.vue'
import PurchaseMenu from '@/components/inc/SubSidebar/PurchaseMenu.vue'
import FormSkeleton from '@/components/skeleton/Form-2.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

import { useMessageStore } from '@/stores/useMessageStore'

/* ================= BASIC ================= */
const router = useRouter()
const route  = useRoute()
const messageStore = useMessageStore()

const loading = ref(true)
const processing = ref(false)

/* ================= ROUTE PARAM ================= */
const purchaseReturnId = route.params.id

/* ================= FORM STATE ================= */
const returnDate = ref(new Date().toISOString().slice(0, 10))
const note = ref('')
const refundAmount = ref(0)
const accountId = ref('')
const paymentNote = ref('')
const status = ref('pending')
const grandTax = ref(0)
const grandDiscount = ref(0)
const grandDiscountType = ref<'flat' | 'percent'>('percent')

/* ================= PURCHASE & SUPPLIER ================= */
const supplier = ref<any>(null)
const purchase = ref<any>(null)
const products = ref<any[]>([])

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

/* ================= CALCULATION ================= */
const lineSubtotal = (p: any) => {
  const qty = Number(p.return_qty) || 0
  const price = Number(p.unit_price) || 0
  const base = qty * price

  const tax = base * (Number(p.tax_rate) || 0) / 100

  let discount = 0
  if (p.discount_type === 'percent') {
    discount = base * (Number(p.discount_value) || 0) / 100
  } else {
    discount = Number(p.discount_value) || 0
  }

  return base + tax - discount
}

const grandSubTotal = computed(() =>
  products.value.reduce((s, p) => s + lineSubtotal(p), 0)
)

const grandTaxAmount = computed(() =>
  grandSubTotal.value * grandTax.value / 100
)

const grandDiscountAmount = computed(() =>
  grandDiscountType.value === 'percent'
    ? grandSubTotal.value * grandDiscount.value / 100
    : grandDiscount.value
)

const netTotal = computed(() =>
  grandSubTotal.value + grandTaxAmount.value - grandDiscountAmount.value
)

/* ================= FETCH PURCHASE RETURN ================= */
const fetchPurchaseReturn = async () => {
  loading.value = true
  try {
    const res = await axiosInstance.get(`/purchase-returns/${purchaseReturnId}`)
    const data = res.data.data

    /* ===== BASIC INFO ===== */
    returnDate.value = data.date
    note.value = data.note
    status.value = data.status
    grandTax.value = data.tax_rate ?? 0
    grandDiscount.value = data.discount_value ?? 0
    grandDiscountType.value = data.discount_type ?? 'percent'

    refundAmount.value = data.refund_amount ?? 0
    accountId.value = data.account_id ?? ''

    /* ===== PAYMENT ===== */
    if (data.purchase_refund) { 
      paymentNote.value = data.purchase_refund.note ?? ''
    }

    /* ===== PURCHASE & SUPPLIER ===== */
    supplier.value = data.purchase.supplier
    purchase.value = {
      invoice_no: data.purchase.invoice_no,
      date: data.purchase.date,
      status: data.purchase.status,
      total_amount: data.purchase.net_total,
      returned_amount: data.purchase.returned_amount ?? 0
    }

    /* ===== PRODUCTS ===== */
    // Map all products from the original purchase
    products.value = data.purchase.details.map((d: any) => {
      const returnedDetail = data.details.find((rd: any) => rd.product_id === d.product.id)
      const alreadyReturnedQty = returnedDetail?.quantity ?? 0
      return {
        product_id: d.product.id,
        name: d.product.name,
        sku: d.product.sku,

        purchased_qty: d.quantity,
        returned_qty: alreadyReturnedQty,
        remaining_qty: d.quantity - (d.returned_qty ?? 0) + alreadyReturnedQty, // remaining + already returned

        return_qty: alreadyReturnedQty, // pre-fill return quantity
        unit_price: d.unit_price,

        tax_rate: d.tax?.tax_rate ?? 0,
        discount_value: d.discount?.value ?? 0,
        discount_type: d.discount?.type ?? 'percent',
      }
    })
  } catch (error) {
  	console.log(error)
    messageStore.showError('Failed to load purchase return')
  } finally {
    loading.value = false
  }
}

/* ================= QTY CONTROL ================= */
const increaseQty = (p: any) => {
  if (p.return_qty < p.remaining_qty) p.return_qty++
}
const decreaseQty = (p: any) => {
  if (p.return_qty > 0) p.return_qty--
}

/* ================= SUBMIT ================= */
const submitReturn = async () => {
  const details = products.value
    .filter(p => p.return_qty > 0)
    .map(p => ({
      product_id: p.product_id,
      quantity: p.return_qty,
      unit_price: p.unit_price,
      tax_rate: p.tax_rate,
      discount_value: p.discount_value,
      discount_type: p.discount_type
    }))

  if (!details.length) {
    messageStore.showError('Please enter return quantity')
    return
  }

  if (refundAmount.value > netTotal.value) {
    messageStore.showError('Refund amount cannot exceed net total')
    return
  }

  processing.value = true
  try {
    await axiosInstance.put(`/purchase-returns/${purchaseReturnId}`, {
      purchase_id: purchase.value.id,
      return_date: returnDate.value,
      tax_rate: grandTax.value,
      discount_value: grandDiscount.value,
      discount_type: grandDiscountType.value,
      refund_amount: refundAmount.value,
      account_id: accountId.value || null,
      status: status.value,
      note: note.value,
      details
    })

    messageStore.showSuccess('Purchase return updated')
    router.push('/purchase-returns')
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
  await fetchPurchaseReturn()
})
</script>


<template>
<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <PurchaseMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

    <Breadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Purchases', to: '/purchase' },
      { label: 'Edit Purchase Return' }
    ]" />

    <div v-if="loading">
      <FormSkeleton :columns="3" :rows="4" />
    </div>

    <form v-else @submit.prevent="submitReturn" class="space-y-4">

      <!-- SUPPLIER -->
      <div class="border border-gray-200 bg-gray-50 p-4">
        <h3 class="text-lg font-semibold">Supplier</h3>
        <p>{{ supplier.name }} - {{ supplier.phone }}</p>
      </div>

      <!-- PURCHASE SHORT DETAILS -->
      <div class="border border-gray-200 bg-gray-50 p-4 space-y-2">
        <h3 class="text-lg font-semibold text-gray-700">
          Purchase Summary
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
          <p><strong>Invoice No:</strong> {{ purchase.invoice_no }}</p>
          <p><strong>Purchase Date:</strong> {{ purchase.date }}</p>
          <p><strong>Status:</strong> {{ purchase.status }}</p>

          <p><strong>Total Items:</strong> {{ products.length }}</p>
          <p><strong>Purchased Total:</strong> ৳ {{ purchase.total_amount }}</p>
          <p><strong>Already Returned:</strong> ৳ {{ purchase.returned_amount }}</p>
        </div>
      </div>

      <!-- RETURN PRODUCTS TABLE -->
      <div v-if="products.length" class="border border-gray-200 p-4 bg-white space-y-4 mb-0">
        <h3 class="text-lg font-semibold text-gray-700">
          Purchased Products
        </h3>

        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">Product</th>
                <th class="px-4 py-2 text-center">Purchased</th>
                <th class="px-4 py-2 text-center">Returned</th>
                <th class="px-4 py-2 text-center">Remaining</th>
                <th class="px-4 py-2 text-center">Return Qty</th>
                <th class="px-4 py-2 text-left">Price</th>
                <th class="px-4 py-2 text-left">Tax %</th>
                <th class="px-4 py-2 text-left">Discount</th>
                <th class="px-4 py-2 text-left">Type</th>
                <th class="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr v-for="p in products" :key="p.product_id" class="hover:bg-gray-50">
                <td class="px-4 py-2">{{ p.name }} - {{ p.sku }}</td>
                <td class="px-4 py-2 text-center">{{ p.purchased_qty }}</td>
                <td class="px-4 py-2 text-center">{{ p.returned_qty }}</td>
                <td class="px-4 py-2 text-center font-semibold">{{ p.remaining_qty }}</td>

                <!-- Return Qty +/- -->
                <td class="px-4 py-2 text-center">
                  <div class="flex justify-center">
                    <div class="flex border rounded overflow-hidden">
                      <button type="button" @click="decreaseQty(p)" class="px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                        </svg>
                      </button>

                      <input type="number" v-model.number="p.return_qty" :max="p.remaining_qty" min="0" class="w-16 text-center border-l border-r focus:outline-none" />

                      <button type="button" @click="increaseQty(p)" class="px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-2">
                  <input type="number" v-model.number="p.unit_price" class="w-20 border p-1 focus:ring-2 focus:ring-gray-500" />
                </td>
                <td class="px-4 py-2">
                  <input type="number" v-model.number="p.tax_rate" class="w-16 border p-1 focus:ring-2 focus:ring-gray-500" />
                </td>
                <td class="px-4 py-2">
                  <input type="number" v-model.number="p.discount_value" class="w-16 border p-1 focus:ring-2 focus:ring-gray-500" />
                </td>
                <td class="px-4 py-2">
                  <select v-model="p.discount_type" class="border p-1 focus:ring-2 focus:ring-gray-500">
                    <option value="flat">Flat</option>
                    <option value="percent">Percent</option>
                  </select>
                </td>
                <td class="px-4 py-2 font-semibold text-right">৳ {{ lineSubtotal(p).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TOTALS -->
      <div class="border border-gray-200 p-4 bg-gray-50 space-y-2 mb-0">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <strong>৳ {{ grandSubTotal.toFixed(2) }}</strong>
        </div>

        <div class="flex gap-2 items-center">
          <span>Tax %</span>
          <input v-model.number="grandTax" class="w-20 border p-1" />
          <span>৳ {{ grandTaxAmount.toFixed(2) }}</span>
        </div>

        <div class="flex gap-2 items-center">
          <span>Discount</span>
          <input v-model.number="grandDiscount" class="w-20 border p-1" />
          <select v-model="grandDiscountType" class="border p-1">
            <option value="flat">Flat</option>
            <option value="percent">Percent</option>
          </select>
          <span>৳ {{ grandDiscountAmount.toFixed(2) }}</span>
        </div>

        <div class="flex justify-between font-bold text-lg border-t pt-2">
          <span>Net Total</span>
          <span>৳ {{ netTotal.toFixed(2) }}</span>
        </div>
      </div>

      <!-- REFUND & PAYMENT -->
      <div class="border border-gray-200 p-4 space-y-3 mb">
        <div>
          <label class="block font-medium mb-1">Return Date <span class="text-red-600">*</span></label>
          <input v-model="returnDate" type="date" class="w-full border p-2 focus:ring-2 focus:ring-gray-500" />
        </div>
        <div>
          <label class="block font-medium mb-1">Refund Amount</label>
          <input v-model="refundAmount" type="number" step="0.001" class="w-full border p-2 focus:ring-2 focus:ring-gray-500" />
        </div>
        <div>
          <label class="block font-medium mb-1">Payment Method</label>
          <select v-model="accountId" class="w-full border p-2 focus:ring-2 focus:ring-gray-500" :disabled="accountLoading || !accounts.length">
            <option value="">Select</option>
            <option v-for="account in accounts" :key="account.id" :value="account.id">{{ account.account_name }}<template v-if="account.account_number"> - {{ account.account_number }}</template></option>
          </select>
        </div>
        <div>
          <label class="block font-medium mb-1">Payment Note</label>
          <textarea v-model="paymentNote" class="w-full border p-2 focus:ring-2 focus:ring-gray-500" rows="2" placeholder="Payment note..."></textarea>
        </div>
        <div>
          <label class="block font-medium mb-1">Status <span class="text-red-600">*</span></label>
          <select v-model="status" class="w-full border p-2 focus:ring-2 focus:ring-gray-500">
            <option value="">Select</option>
            <option value="pending">Pending</option>
            <option value="approved">Approve</option>
            <option value="cancelled">Cancel</option>
          </select>
        </div>
      </div>

      <button type="submit" :disabled="processing" class="w-full bg-gray-600 text-white p-3 font-semibold">
        {{ processing ? 'Processing...' : 'Update Return' }}
      </button>

    </form>
  </div>
</div>
</template>
