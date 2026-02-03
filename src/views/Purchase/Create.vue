<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TableSkeleton from '@/components/Skeleton/Table.vue'
import PurchaseMenu from '@/components/inc/SubSidebar/PurchaseMenu.vue'
import FormSkeleton from '@/components/skeleton/Form-2.vue'
import { $routes, $labels } from '@/constants/purchase'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
const router = useRouter()
const route = useRoute()


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


const getToday = () => {
  return new Date().toISOString().slice(0, 10);
}

/* ===============================
  SINGLE STATE
================================ */

const row = ref({
  purchase_date: getToday(),
  supplier_id: null,
  invoice_note: '',
  paid_amount: 0,
  account_id: '',
  payment_note: '',
  tax_rate: 0,
  discount_value: 0,
  discount_type: 'percent',
  status: '',
})

const rounded = (val: number) => Math.round(val * 10000) / 10000;

const date = ref(getToday())
const invoiceNote = ref('')
const paymentAmount = ref('')
const accountId = ref('')
const paymentNote = ref('')
const grandTax = ref(0)
const grandDiscount = ref(0)
const grandDiscountType = ref('percent')
const status = ref('pending')


const processing = ref<boolean>(false);
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


/* =====================================================
   Calculation
===================================================== */
const productSubtotal = (p) => {
  if (!p) return 0

  const qty = Number(p.qty) || 0
  const cost_price = Number(p.cost_price) || 0
  const base = rounded(qty * cost_price)

  const taxRate = Number(p.tax?.tax_value) || 0
  const taxAmount = rounded(base * taxRate / 100)

  let discountAmount = 0
  if (p.discount_type === 'percent') {
    discountAmount = rounded(base * (Number(p.discount_value) || 0) / 100)
  } else if (p.discount_type === 'flat') {
    discountAmount = Number(p.discount_value) || 0
  }

  return rounded(base + taxAmount - discountAmount)
}

/* ================= GRAND TOTAL ================= */
const grandSubTotal = computed(() =>
  selectedProducts.value.reduce((sum, p) => sum + productSubtotal(p), 0)
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

// modal component
import SupplierList from '@/components/modals/supplier/SupplierList.vue'
/* ===============================
  STATE
================================ */
const showSupplierModal = ref(false)
const supplier = ref<any>(null)

/* ===============================
  HANDLERS
================================ */
const openSupplierModal = () => {
  showSupplierModal.value = true
}
const onSupplierSelected = (selected: any) => {
  supplier.value = selected
  showSupplierModal.value = false
}

onMounted(async () => {
  const uuid = route.params.supplier_id
  if (uuid) {
    await fetchSupplier(uuid as string)
  }
})

const fetchSupplier = async (uuid: string) => {
  try {
    const res = await axiosInstance.get(`/suppliers/option/single/${uuid}`)
    supplier.value = res.data.data
  } catch (err) {
    console.error('Failed to fetch supplier', err)
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

/* =====================================================
   Submit Rows
===================================================== */
const submitRows = async () => {
  if (processing.value) return

  if (!selectedProducts.value.length) {
    messageStore.showError('Please select at least one product.')
    return
  }

  processing.value = true

  try {

      row.value.purchase_date       = date.value
      row.value.supplier_id         = supplier.value?.id ?? null
      row.value.invoice_note        = invoiceNote.value
      row.value.tax_rate            = grandTax.value
      row.value.discount_value      = grandDiscount.value
      row.value.discount_type       = grandDiscountType.value || 'percent'
      row.value.paid_amount         = paymentAmount.value
      row.value.account_id          = accountId.value
      row.value.payment_note        = paymentNote.value
      row.value.status              = status.value

    await axiosInstance.post('/purchases', {
      ...row.value,
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

    messageStore.showSuccess('Purchase created successfully!')

    // optional reset
    productPopup.selectedProducts = []
    router.push($routes.index)

  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(
        err.response?.data?.message || 'Failed to create purchase.'
      )
    } else {
      messageStore.showError('Unexpected error occurred.')
    }
  } finally {
    processing.value = false
  }
}


/* =====================================================
   INIT
===================================================== */
onMounted(() => {
  loadAccounts()
  loadadjustmentHeads()
})

</script>

<template>
  <div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <PurchaseMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <h2 class="text-2xl font-semibold text-gray-700">Add New {{ $labels.singular_name }}</h2>

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

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <FormSkeleton :columns="3" :rows="4" />
    </div>

    <form v-else @submit.prevent="submitRows" class="space-y-4" >
      <!-- Supplier Info -->
      <div v-if="supplier" class="border border-gray-200 bg-gray-50 p-4 space-y-3">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-700">Supplier Information</h3>
          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 text-sm rounded-full"
              :class="supplier.prev_due > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'"
            >
              Prev Due: ৳ {{ supplier.prev_due }}
            </span>
            <button
              type="button"
              @click="openSupplierModal"
              class="flex items-center gap-1 px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
          <p><strong>Name:</strong> {{ supplier.name }}</p>
          <p><strong>Phone:</strong> {{ supplier.phone }}</p>
          <p class="md:col-span-2"><strong>Address:</strong> {{ supplier.address }}</p>
        </div>
      </div>

      <!-- ================= Supplier MODAL ================= -->
          <SupplierList
            v-model="showSupplierModal"
            @selected="onSupplierSelected"
          />
      <!-- ================= END MODAL ================= -->


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
                        min="0" step="0.0001"
                        v-model.number="p.qty"
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



      <!-- Submit -->
      <button
        type="submit"
        :disabled="processing"
        class="w-full bg-gray-500 text-white font-semibold p-3 hover:bg-gray-600 transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ processing ? 'Processing...' : 'Submit' }}
      </button>

    </form>

  </div>
  
</div>
</template>
