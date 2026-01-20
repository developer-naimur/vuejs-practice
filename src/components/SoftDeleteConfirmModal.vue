<script setup lang="ts">
import { computed } from 'vue'
import { useSoftDeleteStore } from '@/stores/useSoftDeleteStore'

const deleteStore = useSoftDeleteStore()

const message = computed(() => {
  const row = deleteStore.selectedRow
  return row ? `Are you sure you want to delete <b>${row.label}</b>?` : ''
})
</script>

<template>
  <div v-if="deleteStore.showDeleteModal" class="fixed inset-0 z-100 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
      <h3 class="text-xl font-semibold text-gray-800 mb-2">
        Confirm Delete
      </h3>

      <p class="text-gray-600 mb-6" v-html="message"></p>

      <div class="flex justify-end gap-3">
        <button @click="deleteStore.closeDeleteModal" class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer">
          Cancel
        </button>

        <button
          @click="deleteStore.confirmDelete(deleteStore.selectedRow.deleteUrl, deleteStore.selectedRow.onSuccess)"
          :disabled="deleteStore.deleting"
          class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
        >
          {{ deleteStore.deleting ? 'Deleting...' : 'Yes, Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>
