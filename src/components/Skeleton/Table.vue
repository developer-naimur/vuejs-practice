<script setup>
defineProps({
  colspan: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <tr v-for="(n, i) in 5" :key="'skeleton-' + n" class="border-b border-gray-100/100 last:border-0">
    <td :colspan="colspan" class="p-5">
      
      <div 
        class="skeleton-row" 
        :style="{ animationDelay: (i * 0.15) + 's' }"
      >
        <div class="h-2.5 w-24 bg-gray-500 rounded-full mb-4 relative overflow-hidden">
          <div class="shimmer"></div>
        </div>

        <div class="space-y-3">
          <div class="h-2 w-full bg-gray-400 rounded-full relative overflow-hidden">
            <div class="shimmer"></div>
          </div>
          <div class="h-2 w-4/5 bg-gray-300 rounded-full relative overflow-hidden">
            <div class="shimmer"></div>
          </div>
        </div>
      </div>

    </td>
  </tr>
</template>

<style scoped>
/* Main Row Animation (Niche theke upore ashar subtle effect) */
.skeleton-row {
  opacity: 0;
  animation: slideUpFade 0.6s ease-out forwards;
}

/* High-End Shimmer (Left to Right Glow) */
.shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(243, 244, 246, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(243, 244, 246, 0) 100%
  );
  animation: shimmer-swipe 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-100%);
}

/* Keyframes */
@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer-swipe {
  0% { transform: translateX(-100%) skewX(-10deg); }
  50%, 100% { transform: translateX(100%) skewX(-10deg); }
}

/* Background Pulse (Subtle breathing effect) */
.h-2, .h-2.5 {
  animation: pulse-bg 2s infinite ease-in-out;
}

@keyframes pulse-bg {
  0%, 100% { background-color: #f3f4f6; }
  50% { background-color: #e5e7eb; }
}
</style>