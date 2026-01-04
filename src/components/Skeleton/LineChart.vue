<template>
  <!-- Chart skeleton -->
  <div class="relative h-[300px] w-full flex flex-col justify-end gap-1">
    <!-- Chart skeleton -->
    <svg class="w-full h-[300px]">
      <!-- Profit line skeleton -->
      <path
        d="M10 200 C 50 180, 100 150, 150 170 S 250 140, 300 160 S 350 120, 400 140"
        stroke="#d1d5db"
        stroke-width="3"
        fill="none"
        class="animate-pulse"
      />
      <!-- Loss line skeleton -->
      <path
        d="M10 250 C 50 240, 100 220, 150 230 S 250 210, 300 220 S 350 200, 400 210"
        stroke="#d1d5db"
        stroke-width="3"
        fill="none"
        class="animate-pulse"
      />
    </svg>
  </div>
</template>