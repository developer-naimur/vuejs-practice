<template>
  <!-- ================= PURCHASE SUMMARY ================= -->
  <div
    v-if="purchaseId"
    class="border border-blue-200 bg-blue-50 p-4 rounded space-y-2"
  >
    <div v-if="loading">
      <TableSkeleton />
    </div>

    <div v-else-if="purchase">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-blue-700">
          Purchase Summary
        </h3>
        <span
          class="px-3 py-1 rounded text-sm"
          :class="purchase.status === 'approved'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'"
        >
          {{ purchase.status }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700">
        <p><strong>Invoice:</strong> {{ purchase.invoice_no }}</p>
        <p><strong>Date:</strong> {{ purchase.date }}</p>
        <p><strong>Supplier:</strong> {{ purchase.supplier?.name }}</p>

        <p><strong>Grand Total:</strong> ৳ {{ purchase.grand_total }}</p>
        <p><strong>Paid:</strong> ৳ {{ purchase.paid_amount }}</p>
        <p><strong>Due:</strong> ৳ {{ purchase.due_amount }}</p>
      </div>

      <div class="border-t pt-2 text-sm">
        <strong>Note:</strong>
        <span class="text-gray-600">
          {{ purchase.description || '—' }}
        </span>
      </div>
    </div>
  </div>
  <!-- ================= END SUMMARY ================= -->
</template>

<script setup>
defineProps({
  purchaseId: [Number, String],
  purchase: Object,
  loading: Boolean,
})
</script>
