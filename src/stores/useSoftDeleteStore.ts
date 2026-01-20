import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'
import { useMessageStore } from '@/stores/useMessageStore'

export const useSoftDeleteStore = defineStore('delete', () => {
  const showDeleteModal = ref(false)
  const deleting = ref(false)
  const selectedRow = ref<any>(null)

  const messageStore = useMessageStore()

  const openDeleteModal = (row: any) => {
    selectedRow.value = row
    showDeleteModal.value = true
  }

  const closeDeleteModal = () => {
    showDeleteModal.value = false
    selectedRow.value = null
  }

  const confirmDelete = async (url: string, onSuccess?: () => void) => {
    if (!selectedRow.value) return

    deleting.value = true

    try {
      await axiosInstance.delete(url)

      messageStore.showSuccess('Row deleted successfully')

      // close modal
      closeDeleteModal()

      // callback after delete success
      if (onSuccess) onSuccess()

    } catch (err) {
      if (err instanceof AxiosError) {
        const res = err.response?.data

        if (res?.errors?.dependencies) {
          const deps = res.errors.dependencies

          const list = deps
            .map((item: string, index: number) => {
              if (index === 0) return item
              return `${index}. ${item}`
            })
            .join('\n')

          messageStore.showError(list)
          return
        }

        messageStore.showError(res?.message || 'Delete failed')
      }
    } finally {
      deleting.value = false
    }
  }

  return {
    showDeleteModal,
    deleting,
    selectedRow,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete
  }
})
