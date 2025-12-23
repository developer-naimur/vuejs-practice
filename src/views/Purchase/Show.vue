<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Purchase Details' }
]

// ------------------------
// purchase Data
const purchase = ref({
  id: 1,
  reference: 'S-1001',
  customer: 'John Doe',
  date: '2025-12-22',
  items: [
    { name: 'Product A', qty: 2, price: 50, tax: 5, discount_type: '%', discount: 10 },
    { name: 'Product B', qty: 1, price: 100, tax: 0, discount_type: 'fixed', discount: 15 },
    { name: 'Product C', qty: 3, price: 30, tax: 10, discount_type: '%', discount: 5 }
  ],
  prevDue: 200,
  paid: 300
})

const showPrevDue = ref(false)

// ------------------------
// Helper Functions
const rowSubtotal = (item) => {
  const base = item.qty * item.price
  const taxAmount = base * (item.tax || 0) / 100
  let discountAmount = 0
  if (item.discount_type === '%') discountAmount = base * (item.discount || 0) / 100
  else discountAmount = item.discount || 0
  return base + taxAmount - discountAmount
}

const totalAmount = () => purchase.value.items.reduce((sum, i) => sum + (i.qty * i.price), 0)
const totalTax = () => purchase.value.items.reduce((sum, i) => sum + (i.qty * i.price * (i.tax || 0)/100), 0)
const totalDiscount = () => purchase.value.items.reduce((sum, i) => {
  if (i.discount_type === '%') return sum + (i.qty * i.price * (i.discount || 0)/100)
  return sum + (i.discount || 0)
}, 0)
const grandTotal = () => totalAmount() + totalTax() - totalDiscount() + (showPrevDue.value ? purchase.value.prevDue : 0)
const balance = () => grandTotal() - purchase.value.paid

// ------------------------
// Buttons
const goBack = () => router.push('/purchase/index')
const createPurchase = () => alert('Create new purchase!')
const deletePurchase = () => {
  if (confirm('Are you sure you want to delete this purchase?')) alert('Deleted!')
}

// ------------------------
// Print
const printInvoice = () => {
  const printContent = document.getElementById('printable-area').innerHTML
  const originalContent = document.body.innerHTML
  document.body.innerHTML = printContent
  window.print()
  document.body.innerHTML = originalContent
  window.location.reload()
}
</script>

<template>
  <div class="p-6 space-y-4">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 class="text-2xl font-semibold text-gray-700">Purchases Invoice</h2>
      </div>

      <div class="flex gap-2 flex-wrap">
	        <button @click="createPurchase" class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer">
	        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
	        </svg>
	        Create purchase
	      </button>

	      <button @click="deletePurchase" class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer">
	        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0 011-1h4a1 1 0 011 1v2"/>
	        </svg>
	        Delete
	      </button>

	      <button @click="goBack" class="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition cursor-pointer">
	        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
	        </svg>
	        Back to List
	      </button>
	        <!-- Print Button -->
		  <button @click="printInvoice" class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer">
		    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		      <path stroke-linecap="round" stroke-linejoin="round" d="M6 9V2h12v7m-6 11v-6m-6 6h12a2 2 0 002-2v-5H4v5a2 2 0 002 2z"/>
		    </svg>
		    Print
		  </button>
      </div>
    </div>

    <!-- Checkbox -->
    <div class="mb-4 flex items-center gap-2">
      <input type="checkbox" v-model="showPrevDue" id="prevDue" />
      <label for="prevDue">Include Previous Due</label>
    </div>

    <!-- Printable Area -->
    <div id="printable-area" class="border p-6 bg-white shadow">

      <!-- Company Header -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">My Company Ltd.</h1>
        <p>Address: 123, Main Street, City</p>
        <p>Phone: +880123456789 | Email: info@company.com</p>
      </div>

      <!-- Invoice Header -->
      <div class="flex justify-between mb-4">
        <div>
          <h3 class="font-bold text-lg">Invoice: {{ purchase.reference }}</h3>
          <p>Date: {{ purchase.date }}</p>
        </div>
        <div>
          <p>Customer: {{ purchase.customer }}</p>
        </div>
      </div>

      <!-- Items Table -->
      <table class="min-w-full border border-gray-200 divide-y divide-gray-200 mb-4">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">#</th>
            <th class="px-4 py-2 text-left">Product</th>
            <th class="px-4 py-2 text-center">Qty</th>
            <th class="px-4 py-2 text-right">Price</th>
            <th class="px-4 py-2 text-right">Tax</th>
            <th class="px-4 py-2 text-right">Discount</th>
            <th class="px-4 py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in purchase.items" :key="index" class="divide-y divide-gray-200">
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ item.name }}</td>
            <td class="px-4 py-2 text-center">{{ item.qty }}</td>
            <td class="px-4 py-2 text-right">{{ item.price.toFixed(2) }}</td>
            <td class="px-4 py-2 text-right">{{ ((item.qty*item.price)*(item.tax||0)/100).toFixed(2) }}</td>
            <td class="px-4 py-2 text-right">
              <span v-if="item.discount_type === '%'">{{ ((item.qty*item.price)*(item.discount||0)/100).toFixed(2) }}</span>
              <span v-else>{{ (item.discount||0).toFixed(2) }}</span>
            </td>
            <td class="px-4 py-2 text-right">{{ rowSubtotal(item).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div class="flex flex-col items-end gap-1 text-right font-medium">
        <div>Total Amount: {{ totalAmount().toFixed(2) }}</div>
        <div>Total Tax: {{ totalTax().toFixed(2) }}</div>
        <div>Total Discount: {{ totalDiscount().toFixed(2) }}</div>
        <div v-if="showPrevDue">Previous Due: {{ purchase.prevDue.toFixed(2) }}</div>
        <div class="font-bold text-lg">Grand Total: {{ grandTotal().toFixed(2) }}</div>
        <div>Paid: {{ purchase.paid.toFixed(2) }}</div>
        <div class="font-semibold">Balance: {{ balance().toFixed(2) }}</div>
      </div>

      <!-- Company Footer -->
      <div class="text-center mt-6 border-t pt-2 text-sm text-gray-500">
        Thank you for your business! | www.company.com
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #printable-area, #printable-area * {
    visibility: visible;
  }
  #printable-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
