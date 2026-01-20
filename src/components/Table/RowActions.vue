<script setup lang="ts">
import { ref } from 'vue'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'
import { useMessageStore } from '@/stores/useMessageStore'

const messageStore = useMessageStore()

const { row, routeBase, onDeleted } = defineProps<{
  row: any
  routeBase: string
  onDeleted?: () => void
}>()

const loading = ref(false)

const restoreRow = async () => {
  if (loading.value) return

  loading.value = true
  try {
    await axiosInstance.post(`/${routeBase}/${row.uuid}/restore`)
    messageStore.showSuccess('Record restored successfully')
    row.installed = true
  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Restore failed')
    }
  } finally {
    loading.value = false
  }
}

const removeRow = async () => {
  if (loading.value) return

  loading.value = true
  try {
    await axiosInstance.delete(`/${routeBase}/${row.uuid}`)
    messageStore.showSuccess('Record removed successfully')
    row.installed = false
  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Remove failed')
    }
  } finally {
    loading.value = false
  }
}

const deleteRow = async () => {
  if (loading.value) return
  if (row.installed) return // restored data can't be delete

  if (!confirm('Do you want to permanently delete this record?')) return

  loading.value = true
  try {
    await axiosInstance.delete(`/${routeBase}/${row.uuid}/force`)
    messageStore.showSuccess('Record permanently deleted')
    onDeleted?.()
  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Permanent delete failed')
    }
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <div class="flex gap-2 items-center">

    <!-- Restore / Remove -->
    <button
      @click="row.installed ? removeRow() : restoreRow()"
      :disabled="loading"
      :class="[
        row.installed
          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-600'
          : 'bg-green-100 text-green-600 hover:bg-green-600',
        loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ]"
      class="p-2 rounded-full hover:text-white transition"
      title="Restore / Remove"
    >
      <svg v-if="loading" class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>

      <svg v-else-if="!row.installed" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v6h6M20 20v-6h-6M5 13a7 7 0 0112-4M19 11a7 7 0 01-12 4" />
      </svg>

      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Permanent Delete -->
    <button
      @click="deleteRow"
      :disabled="loading || row.installed"
      :class="loading || row.installed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
      class="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
      title="Permanent Delete"
    >
      <svg v-if="loading" class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>

      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4" />
      </svg>
    </button>

  </div>
</template>
