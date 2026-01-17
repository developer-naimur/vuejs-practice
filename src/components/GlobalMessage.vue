<script setup lang="ts">
import { watch } from 'vue'
import { useMessageStore } from '@/stores/useMessageStore'

const messageStore = useMessageStore()

let timer: ReturnType<typeof setTimeout> | null = null

watch(
  () => messageStore.visible,
  (visible) => {
    if (visible) {
      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
        messageStore.close()
      }, 5000)
    }
  }
)
</script>

<template>
  <transition name="fade">
    <div
      v-if="messageStore.visible"
      class="fixed top-5 right-5 z-50 w-[380px] p-4 rounded-xl shadow-xl flex items-start gap-3 border"
      :class="messageStore.type === 'success'
        ? 'bg-white border-green-200'
        : 'bg-white border-red-200'"
    >
      
      <!-- Icon -->
      <div
        class="w-9 h-9 rounded-full flex items-center justify-center"
        :class="messageStore.type === 'success'
          ? 'bg-green-50 text-green-600'
          : 'bg-red-50 text-red-600'"
      >
        <svg v-if="messageStore.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>

        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <!-- Message -->
      <div class="flex-1 text-sm font-medium text-gray-700">
        {{ messageStore.message }}
      </div>

      <!-- Close Icon -->
      <button
        @click="messageStore.close"
        class="text-xl leading-none hover:opacity-70 text-gray-500"
      >
        &times;
      </button>
    </div>
  </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
