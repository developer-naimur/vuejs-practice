<template>
  <!-- ================= SALE SUMMARY ================= -->
  <div
    v-if="saleId"
    class="border border-blue-200 bg-blue-50 p-4 rounded space-y-2"
  >
    <div v-if="loading">
      <TableSkeleton />
    </div>

    <div v-else-if="sale">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-blue-700">
          Sales Summary
        </h3>
        <span
          class="px-3 py-1 rounded text-sm"
          :class="sale.status === 'approved'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'"
        >
          {{ sale.status }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700">
        <p><strong>Invoice:</strong> {{ sale.invoice_no }}</p>
        <p><strong>Date:</strong> {{ sale.date }}</p>
        <p><strong>Customer:</strong> {{ sale.customer?.name }}</p>

        <p><strong>Grand Total:</strong> ৳ {{ sale.grand_total }}</p>
        <p><strong>Paid:</strong> ৳ {{ sale.paid_amount }}</p>
        <p><strong>Due:</strong> ৳ {{ sale.due_amount }}</p>
      </div>

      <div class="border-t pt-2 text-sm">
        <strong>Note:</strong>
        <span class="text-gray-600">
          {{ sale.description || '—' }}
        </span>
      </div>
    </div>
  </div>
  <!-- ================= END SUMMARY ================= -->
</template>

<script setup>
defineProps({
  saleId: [Number, String],
  sale: Object,
  loading: Boolean,
})
</script>
