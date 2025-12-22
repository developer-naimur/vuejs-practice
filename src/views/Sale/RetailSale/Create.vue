<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

const router = useRouter()

/* ================= BREADCRUMB ================= */
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Sale', to: '/sale/retail-sale' },
  { label: 'Add New Sale' }
]

/* ================= CUSTOMER INFO ================= */
const customer = ref({
  name: 'Rahim Uddin',
  phone: '017XXXXXXXX',
  address: 'Dhaka, Bangladesh',
  prev_due: 2500
})

// ------------------------
// Customer List (for modal)
// ------------------------
const customers = ref([
  { id: 1, name: 'Rahim Uddin', phone: '017XXXXXXXX', address: 'Dhaka' , prev_due: 2500},
  { id: 2, name: 'John Doe', phone: '018XXXXXXXX', address: 'Chittagong', prev_due: 1500 },
  { id: 3, name: 'Jane Smith', phone: '019XXXXXXXX', address: 'Sylhet', prev_due: 2000 },
  { id: 4, name: 'Alex Brown', phone: '016XXXXXXXX', address: 'Khulna', prev_due: 2000 },
  { id: 5, name: 'Mary Jane', phone: '015XXXXXXXX', address: 'Barishal', prev_due: 500 }
])

// ------------------------
// Filters & Pagination
// ------------------------
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = ref(5)

const filteredCustomers = computed(() =>
  customers.value
    .filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .slice((currentPage.value-1)*perPage.value, currentPage.value*perPage.value)
)

// ------------------------
// Modal State
// ------------------------
const modalOpen = ref(false)

// ------------------------
// Methods
// ------------------------
const changeCustomer = () => {
  modalOpen.value = true
}

const selectCustomer = (c) => {
  // Close modal
  modalOpen.value = false

  // Update customer info locally
  customer.value = c

  // Navigate to same page with selected customer's id in the URL
  router.push(`/sale/retail-sale/create/${c.id}`)
}

const resetFilters = () => searchQuery.value = ''


/* ================= MODAL STATE ================= */
const open = ref(false)

/* ================= PRODUCTS DATA (demo) ================= */
const allProducts = ref([
  { id: 1, name: 'Apple', brand: 'Fruit', price: 120 },
  { id: 2, name: 'Banana', brand: 'Fruit', price: 60 },
  { id: 3, name: 'Laptop', brand: 'Electronics', price: 65000 },
  { id: 4, name: 'Mouse', brand: 'Electronics', price: 1200 },
  { id: 5, name: 'Keyboard', brand: 'Electronics', price: 2500 }
])

const selectedProducts = ref([])

/* ================= FILTERS ================= */
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

/* ================= ACTIONS ================= */
const addProduct = (product) => {
  selectedProducts.value.push({ ...product, qty: 1, tax: 0, discount: 0, discount_type: '%' })
}

const removeProduct = (product) => {
  selectedProducts.value = selectedProducts.value.filter(p => p.id !== product.id)
}

const updateQty = (p, type) => {
  if (type === 'plus') p.qty++
  if (type === 'minus' && p.qty > 1) p.qty--
}

const productSubtotal = (p) => {
  if (!p) return 0           // handle undefined/null product
  const qty = Number(p.qty) || 0
  const price = Number(p.price) || 0
  const base = qty * price
  const taxAmount = base * (Number(p.tax) || 0) / 100
  let discountAmount = 0
  if (p.discount_type === '%') discountAmount = base * (Number(p.discount) || 0) / 100
  else discountAmount = Number(p.discount) || 0
  return base + taxAmount - discountAmount
}

/* ================= GRAND TOTAL ================= */
const grandSubTotal = computed(() =>
  selectedProducts.value.reduce((sum, p) => sum + productSubtotal(p), 0)
)

const grandTax = ref(0)
const grandDiscount = ref(0)
const grandDiscountType = ref('%')

const grandTaxAmount = computed(() =>
  grandSubTotal.value * grandTax.value / 100
)

const grandDiscountAmount = computed(() => {
  return grandDiscountType.value === '%'
    ? grandSubTotal.value * grandDiscount.value / 100
    : grandDiscount.value
})

const netTotal = computed(() =>
  grandSubTotal.value + grandTaxAmount.value - grandDiscountAmount.value
)

/* ================= INVOICE & PAYMENT ================= */
const invoiceNote = ref('')
const paymentMethod = ref('cash')
const paymentNote = ref('')
</script>

<template>
  <div class="p-6 space-y-4">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <h2 class="text-2xl font-semibold text-gray-700">Add New Sale</h2>

      <div class="flex gap-2 flex-wrap">
        <router-link to="/sale/retail-sale" class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
		        <rect x="3" y="3" width="7" height="7" rx="1" ry="1"/>
		        <rect x="14" y="3" width="7" height="7" rx="1" ry="1"/>
		        <rect x="3" y="14" width="7" height="7" rx="1" ry="1"/>
		        <rect x="14" y="14" width="7" height="7" rx="1" ry="1"/>
		    </svg>
          View All
        </router-link>

        <router-link to="/sale/retail-sale/trashed" class="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer">
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

    <!-- Customer Info -->
    <div v-if="customer" class="border  bg-gray-50 p-4 space-y-3">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-700">Customer Information</h3>
        <div class="flex items-center gap-2">
          <span
            class="px-3 py-1 text-sm rounded-full"
            :class="customer.prev_due > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'"
          >
            Prev Due: ৳ {{ customer.prev_due }}
          </span>
          <button
            @click="changeCustomer"
            class="flex items-center gap-1 px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
        <p><strong>Name:</strong> {{ customer.name }}</p>
        <p><strong>Phone:</strong> {{ customer.phone }}</p>
        <p class="md:col-span-2"><strong>Address:</strong> {{ customer.address }}</p>
      </div>
    </div>
    <!-- ================= CUSTOMER MODAL ================= -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black/50 flex justify-center items-center z-100">
      <div class="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6">

        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">Select Customer</h3>
          <button @click="modalOpen = false" class="text-gray-500 hover:text-red-600 text-2xl cursor-pointer">✕</button>
        </div>

        <!-- Search -->
        <div class="mb-4 flex gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name"
            class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button @click="resetFilters" class="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer">Reset</button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto max-h-64">
          <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">#</th>
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-left">Phone</th>
                <th class="px-4 py-2 text-left">Address</th>
                <th class="px-4 py-2 text-center">Select</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(c, index) in filteredCustomers" :key="c.id" class="hover:bg-gray-50">
                <td class="px-4 py-2">{{ (currentPage-1)*perPage + index + 1 }}</td>
                <td class="px-4 py-2">{{ c.name }}</td>
                <td class="px-4 py-2">{{ c.phone }}</td>
                <td class="px-4 py-2">{{ c.address }}</td>
                <td class="px-4 py-2 text-center">
                	<button @click="selectCustomer(c)" class="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                      title="Go">
		                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
		                     viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
		                  <path stroke-linecap="round" stroke-linejoin="round"
		                        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
		                  <circle cx="9" cy="7" r="4" />
		                  <path stroke-linecap="round" stroke-linejoin="round"
		                        d="M19 8l4 4m0 0l-4 4m4-4H12" />
		                </svg>
	              	</button>

                </td>
              </tr>
              <tr v-if="filteredCustomers.length === 0">
                <td colspan="5" class="text-center py-6 text-gray-400">No customer found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-end gap-2 mt-4">
          <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="currentPage = Math.max(currentPage-1,1)">&laquo;</button>
          <button v-for="n in Math.ceil(customers.length/perPage)" :key="n" class="px-3 py-1 border rounded hover:bg-gray-100" @click="currentPage=n">{{ n }}</button>
          <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="currentPage = Math.min(currentPage+1, Math.ceil(customers.length/perPage))">&raquo;</button>
        </div>

      </div>
    </div>
    <!-- ================= END MODAL ================= -->


    <!-- Get Products Button -->
    <button
      type="button"
      @click="open = true"
      class="text-2xl w-full bg-yellow-500 text-white font-semibold p-4 hover:bg-yellow-600 transition cursor-pointer"
    >
      Get Products
    </button>

    <!-- Selected Products Table -->
    <div v-if="selectedProducts.length" class="border  p-4 bg-white space-y-4">
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
              <td class="px-4 py-2">
                <input type="number" v-model.number="p.price" class="w-20 border p-1 focus:ring-2 focus:ring-gray-500" />
              </td>
              <td class="px-4 py-2">
                <input type="number" v-model.number="p.tax" class="w-16 border p-1 focus:ring-2 focus:ring-gray-500" />
              </td>
              <td class="px-4 py-2">
                <input type="number" v-model.number="p.discount" class="w-16 border p-1 focus:ring-2 focus:ring-gray-500" />
              </td>
              <td class="px-4 py-2">
                <select v-model="p.discount_type" class="border p-1 focus:ring-2 focus:ring-gray-500">
                  <option value="%">%</option>
                  <option value="flat">Flat</option>
                </select>
              </td>
              <td class="px-4 py-2 font-semibold text-right">৳ {{ productSubtotal(p).toFixed(2) }}</td>
              <td class="px-4 py-2 text-center">
                <button @click="removeProduct(p)" class="text-red-600 cursor-pointer">✕</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grand Total Section -->
    <div class="border  p-4 bg-gray-50 space-y-3">
      <div class="flex justify-between"><span>Subtotal</span><strong>৳ {{ grandSubTotal.toFixed(2) }}</strong></div>
      <div class="flex gap-2 items-center">
        <span>Tax %</span>
        <input type="number" v-model.number="grandTax" class="w-20 border p-1 focus:ring-2 focus:ring-gray-500" />
        <span>৳ {{ grandTaxAmount.toFixed(2) }}</span>
      </div>
      <div class="flex gap-2 items-center">
        <span>Discount</span>
        <input type="number" v-model.number="grandDiscount" class="w-20 border p-1 focus:ring-2 focus:ring-gray-500" />
        <select v-model="grandDiscountType" class="border p-1 focus:ring-2 focus:ring-gray-500">
          <option value="%">%</option>
          <option value="flat">Flat</option>
        </select>
        <span>৳ {{ grandDiscountAmount.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between text-lg font-bold border-t pt-2">
        <span>Net Total</span>
        <span>৳ {{ netTotal.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Invoice Note -->
    <div class="border  p-4">
      <label class="block font-medium mb-1">Invoice Note</label>
      <textarea v-model="invoiceNote" class="w-full border p-2 focus:ring-2 focus:ring-gray-500" rows="3" placeholder="Invoice note..."></textarea>
    </div>

    <!-- Payment Section -->
    <div class="border  p-4 space-y-3">
      <div>
        <label class="block font-medium mb-1">Payment Method</label>
        <select v-model="paymentMethod" class="w-full border p-2 focus:ring-2 focus:ring-gray-500">
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
          <option value="mobile">Mobile Banking</option>
        </select>
      </div>
      <div>
        <label class="block font-medium mb-1">Payment Note</label>
        <textarea v-model="paymentNote" class="w-full border p-2 focus:ring-2 focus:ring-gray-500" rows="2" placeholder="Payment note..."></textarea>
      </div>
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
      <div class="bg-white rounded-xl shadow-xl max-w-6xl w-full h-[85vh] flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-center px-6 py-4 border-b">
          <h3 class="text-xl font-semibold text-gray-700">Select Products</h3>
          <button @click="open = false" class="text-gray-500 hover:text-red-600 text-2xl">✕</button>
        </div>
        <!-- Filters -->
        <div class="px-6 py-3 border-b bg-gray-50 flex gap-3">
          <input
            v-model="search"
            placeholder="Search by product name"
            class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <select v-model="brand" class="border rounded px-3 py-2 w-48 focus:ring-2 focus:ring-yellow-400 outline-none">
            <option value="">All Brands</option>
            <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
          </select>
        </div>
        <!-- Body -->
        <div class="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
          <!-- Products -->
          <div class="col-span-2 border  overflow-hidden flex flex-col">
            <div class="px-4 py-2 font-semibold">Products</div>
            <div class="flex-1 overflow-y-auto">
              <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-4 py-2">Name</th>
                    <th class="px-4 py-2">Brand</th>
                    <th class="px-4 py-2 text-right">Price</th>
                    <th class="px-4 py-2 text-center w-16">Add</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="p in products" :key="p.id" class="hover:bg-gray-50">
                    <td class="px-4 py-2 font-medium">{{ p.name }}</td>
                    <td class="px-4 py-2 text-gray-500">{{ p.brand }}</td>
                    <td class="px-4 py-2 text-right">৳ {{ p.price }}</td>
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
          <div class="border  overflow-hidden flex flex-col">
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
        <div class="border-t px-6 py-3 flex justify-end bg-gray-50">
          <button @click="open = false" class="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">Done</button>
        </div>
      </div>
    </div>

  </div>
</template>
