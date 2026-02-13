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

const purchaseId = route.params.purchase_id

const rounded = (val: number) => Math.round(val * 10000) / 10000;

/* ================= HELPERS ================= */
const getToday = () => new Date().toISOString().slice(0, 10)

/* ================= FORM ================= */
const returnDate = ref(getToday())
const note = ref('')
const refundAmount = ref(0)
const accountId = ref('')
const paymentNote = ref('')
const status = ref('pending')

const grandTax = ref(0)
const grandDiscount = ref(0)
const grandDiscountType = ref<'flat' | 'percent'>('percent')

/* ================= PURCHASE ================= */
const supplier = ref<any>(null)
const purchase = ref<any>(null)
const products = ref<any[]>([])

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

const netBeforeAdjustment = computed(() =>
  grandSubTotal.value + grandTaxAmount.value - grandDiscountAmount.value
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

/* ================= FETCH PURCHASE ================= */
const fetchPurchase = async () => {
  loading.value = true
  try {
    const res = await axiosInstance.get(`/purchases/${purchaseId}`, {
      params: { for: 'return' }
    })

    const p = res.data.data
    supplier.value = p.supplier

    purchase.value = {
	  invoice_no: p.invoice_no,
	  date: p.date,
	  status: p.status,
	  total_amount: p.net_total,
	  returned_amount: p.returned_amount ?? 0,
	}

    products.value = p.details.map((d: any) => ({
      product_id: d.product.id,
      name: d.product.name,
      sku: d.product.sku,

      purchased_qty: d.quantity,
      returned_qty: d.returned_qty || 0,
      remaining_qty: d.quantity - (d.returned_qty || 0),

      return_qty: 0,
      unit_price: d.unit_price,

      tax_rate: d.tax?.tax_rate ?? 0,
      discount_value: d.discount?.value ?? 0,
      discount_type: d.discount?.type ?? 'percent',
    }))
  } catch {
    messageStore.showError('Failed to load purchase')
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
      discount_type: p.discount_type,
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
    await axiosInstance.post('/purchase-returns', {
      purchase_id: purchaseId,
      return_date: returnDate.value,
      tax_rate: grandTax.value,
      discount_value: grandDiscount.value,
      discount_type: grandDiscountType.value,
      refund_amount: refundAmount.value,
      account_id: accountId.value || null,
      payment_note: paymentNote.value || null,
      status: status.value,
      note: note.value,
      details,

      adjustments: adjustments.value.map(a => ({
        adjustment_head_id: a.adjustment_head_id,
        type: a.type,
        value_type: a.value_type,
        value: a.value,
        note: a.note,
      })),
    })

    messageStore.showSuccess('Purchase return created')
    router.push('/purchase-return')
  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Return failed')
    }
  } finally {
    processing.value = false
  }
}
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

    <Breadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Purchases', to: '/purchase' },
      { label: 'Purchase Return' }
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

	<!-- ================= PURCHASE SHORT DETAILS ================= -->
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

     <!-- ================= RETURN PRODUCTS TABLE ================= -->
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
	          <!-- Product -->
	          <td class="px-4 py-2">
	            {{ p.name }} - {{ p.sku }}
	          </td>

	          <!-- Purchased -->
	          <td class="px-4 py-2 text-center">
	            {{ p.purchased_qty }}
	          </td>

	          <!-- Returned -->
	          <td class="px-4 py-2 text-center">
	            {{ p.returned_qty }}
	          </td>

	          <!-- Remaining -->
	          <td class="px-4 py-2 text-center font-semibold">
	            {{ p.remaining_qty }}
	          </td>

	          <!-- Return Qty (same +/- UI) -->
	          <td class="px-4 py-2 text-center">
	            <div class="flex justify-center">
	              <div class="flex border rounded overflow-hidden">
	                <!-- Minus -->
	                <button
	                  type="button"
	                  @click="decreaseQty(p)"
	                  class="px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition"
	                >
	                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
	                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
	                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
	                  </svg>
	                </button>

	                <!-- Input -->
	                <input
	                  type="number"
	                  v-model.number="p.return_qty"
	                  :max="p.remaining_qty"
	                  min="0"
	                  class="w-16 text-center border-l border-r focus:outline-none"
	                />

	                <!-- Plus -->
	                <button
	                  type="button"
	                  @click="increaseQty(p)"
	                  class="px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition"
	                >
	                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
	                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
	                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
	                  </svg>
	                </button>
	              </div>
	            </div>
	          </td>

	          <!-- Price -->
	          <td class="px-4 py-2">
	            <input
	              type="number"
	              v-model.number="p.unit_price"
	              class="w-20 border p-1 focus:ring-2 focus:ring-gray-500"
	            />
	          </td>

	          <!-- Tax -->
	          <td class="px-4 py-2">
	            <input
	              type="number"
	              v-model.number="p.tax_rate"
	              class="w-16 border p-1 focus:ring-2 focus:ring-gray-500"
	            />
	          </td>

	          <!-- Discount -->
	          <td class="px-4 py-2">
	            <input
	              type="number"
	              v-model.number="p.discount_value"
	              class="w-16 border p-1 focus:ring-2 focus:ring-gray-500"
	            />
	          </td>

	          <!-- Discount Type -->
	          <td class="px-4 py-2">
	            <select
	              v-model="p.discount_type"
	              class="border p-1 focus:ring-2 focus:ring-gray-500"
	            >
	              <option value="flat">Flat</option>
	              <option value="percent">Percent</option>
	            </select>
	          </td>

	          <!-- Subtotal -->
	          <td class="px-4 py-2 font-semibold text-right">
	            ৳ {{ lineSubtotal(p).toFixed(2) }}
	          </td>
	        </tr>

	      </tbody>
	    </table>
	  </div>
	</div>


      <!-- TOTAL -->
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

      <!-- Refund Note -->
      <div class="border border-gray-200 p-4 mb-0">
        <label class="block font-medium mb-1">Refund Note</label>
        <textarea v-model="note" class="w-full border p-2 focus:ring-2 focus:ring-gray-500" rows="3" placeholder="Refund note..."></textarea>
      </div>

      <!-- Refund Section -->
      <div class="border border-gray-200 p-4 space-y-3 mb">
        <div>
          <label class="block font-medium mb-1">Return Date <span class="text-red-600">*</span></label>
          <input v-model="returnDate" type="date" 
            class="w-full border p-2 focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <div>
          <label class="block font-medium mb-1">Refund Amount</label>
          <input v-model="refundAmount" type="number" step="0.001" 
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

      <button
        type="submit"
        :disabled="processing"
        class="w-full bg-gray-600 text-white p-3 font-semibold"
      >
        {{ processing ? 'Processing...' : 'Create Return' }}
      </button>

    </form>
  </div>
</div>
</template>
