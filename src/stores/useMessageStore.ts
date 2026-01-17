import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMessageStore = defineStore('message', () => {
  const message = ref('')
  const type = ref<'success' | 'error' | ''>('')
  const visible = ref(false)

  const showSuccess = (msg: string) => {
    message.value = msg
    type.value = 'success'
    visible.value = true
  }

  const showError = (msg: string) => {
    message.value = msg
    type.value = 'error'
    visible.value = true
  }

  const close = () => {
    visible.value = false
    message.value = ''
    type.value = ''
  }

  return {
    message,
    type,
    visible,
    showSuccess,
    showError,
    close,
  }
})
