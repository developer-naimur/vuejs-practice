<script setup lang="ts">
import { ref } from 'vue'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'
import { useMessageStore } from '@/stores/useMessageStore'

const messageStore = useMessageStore()

const emit = defineEmits(['saved', 'cancel'])

/* =====================================================
   Add Row (same as your page)
===================================================== */
const newRows = ref([{ name: '', value: '', status: '' }])
const addRowField = () => newRows.value.push({ name: '', value: '', status: '' })

const copyRowField = (index) => {
  const rowToCopy = { ...newRows.value[index] }
  newRows.value.splice(index + 1, 0, rowToCopy)
}

const removeRowField = (index) => {
  if (newRows.value.length > 1) {
    newRows.value.splice(index, 1)
  }
}

/* =====================================================
   Submit
===================================================== */
const processing = ref(false)

const submitRows = async () => {
  if (processing.value) return
  processing.value = true

  try {
    await axiosInstance.post('/taxes', {
      rows: newRows.value
    })

    messageStore.showSuccess('Tax created successfully!')
    emit('saved') // 🔥 IMPORTANT
    newRows.value = [{ name: '', value: '', status: '' }]

  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Error')
    } else {
      messageStore.showError('Unexpected error')
    }
  } finally {
    processing.value = false
  }
}
</script>
<template>
  <form @submit.prevent="submitRows" class="space-y-4">

    <div v-for="(row, index) in newRows" :key="index"
         class="flex gap-4 items-end border-b pb-4">

      <div class="flex-1">
        <label class="text-sm font-medium">Name *</label>
        <input v-model="row.name" class="w-full border p-3" />
      </div>

      <div class="flex-1">
        <label class="text-sm font-medium">Value *</label>
        <input type="number" step="0.01" v-model="row.value" class="w-full border p-3" />
      </div>

      <div class="flex-1">
        <label class="text-sm font-medium">Status *</label>
        <select v-model="row.status" class="w-full border p-3">
          <option value="">Select</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="flex gap-2">
        <button type="button" @click="removeRowField(index)"
                :disabled="newRows.length === 1"
                class="px-3 py-2 bg-red-100">✕</button>

        <button v-if="index === newRows.length - 1"
                type="button"
                @click="copyRowField(index)"
                class="px-3 py-2 bg-blue-500 text-white">⧉</button>

        <button v-if="index === newRows.length - 1"
                type="button"
                @click="addRowField"
                class="px-3 py-2 bg-green-500 text-white">＋</button>
      </div>
      
    </div>

    <div class="flex justify-end gap-2 pt-4">
      <button type="button" @click="$emit('cancel')" class="px-4 py-2 bg-gray-200">
        Cancel
      </button>

      <button type="submit"
              :disabled="processing"
              class="px-4 py-2 bg-gray-600 text-white">
        {{ processing ? 'Saving...' : 'Save Tax' }}
      </button>
    </div>

  </form>
</template>
