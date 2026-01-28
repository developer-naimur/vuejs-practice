<script setup lang="ts">
import TableSkeleton from '@/components/Skeleton/Table.vue'
import { useProductPopupStore } from '@/composables/useProductPopupStore'

const popup = useProductPopupStore()
</script>

<template>
  <div
    v-if="popup.open"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <div class="bg-white w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b">
        <h3 class="text-lg font-semibold text-gray-800">Select Products</h3>
        <button
          @click="popup.closePopup()"
          class="text-gray-400 hover:text-gray-700 transition p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Filters -->
      <div class="px-6 py-4 bg-gray-50 border-b flex flex-wrap items-center gap-4">
        <!-- Search -->
        <div class="relative w-full md:w-1/3">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/>
            </svg>
          </span>
          <input
            v-model="popup.search"
            type="text"
            placeholder="Search by name / SKU"
            class="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 text-sm
                   focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none shadow-sm"
          />
        </div>

        <!-- Brand -->
        <div class="w-full md:w-1/4 relative">
          <select
            v-model="popup.brand_id"
            :disabled="popup.brandLoading"
            class="w-full py-2 px-3 rounded-lg border border-gray-300 text-sm
                   focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none
                   disabled:bg-gray-100 shadow-sm appearance-none"
          >
            <option value="">All Brands</option>
            <option v-for="b in popup.brands" :key="b.id" :value="b.id">
              {{ b.brand_name }}
            </option>
          </select>
          <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </div>

        <!-- Reset -->
        <button
          @click="popup.resetFilters()"
          class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm transition flex items-center gap-1 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 4a1 1 0 011-1h5l1 2h7a1 1 0 110 2H5a1 1 0 01-1-1z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 9v10a2 2 0 002 2h8a2 2 0 002-2V9"/>
          </svg>
          Reset
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">

        <!-- Product List -->
        <div class="col-span-2 bg-white border rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div class="flex-1 overflow-y-auto">
            <table class="w-full text-sm">
              <thead class="sticky top-0 bg-gray-100 border-b shadow-inner">
                <tr class="text-left text-gray-600 uppercase text-xs tracking-wider">
                  <th class="px-4 py-3">Name</th>
                  <th class="px-4 py-3">Brand</th>
                  <th class="px-4 py-3 text-center">Add</th>
                </tr>
              </thead>

              <tbody class="divide-y">
                <TableSkeleton v-if="popup.loading" :colspan="100" />

                <tr
                  v-else
                  v-for="p in popup.products"
                  :key="p.id"
                  class="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td class="px-4 py-3 font-medium text-gray-800">{{ p.name }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ p.brand.brand_name }}</td>
                  <td class="px-4 py-3 text-center">
                    <button
                      @click="popup.addProduct(p)"
                      class="w-8 h-8 rounded-full bg-yellow-500 text-white
                             hover:bg-yellow-600 transition flex items-center justify-center shadow"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </td>
                </tr>

                <tr v-if="!popup.loading && !popup.products.length">
                  <td colspan="3" class="text-center py-10 text-gray-400 italic">
                    No products found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Selected Products -->
        <div class="bg-white border rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div class="px-4 py-3 border-b font-semibold text-gray-700 bg-gray-50">
            Selected ({{ popup.selectedProducts.length }})
          </div>

          <div class="flex-1 overflow-y-auto flex flex-col gap-2 p-3">
            <div
              v-for="p in popup.selectedProducts"
              :key="p.id"
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <span class="text-sm text-gray-800 truncate">{{ p.name }}</span>

              <button
                @click="popup.removeProduct(p)"
                class="w-7 h-7 rounded-full bg-red-100 text-red-600
                       hover:bg-red-200 transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="border-t px-6 py-4 flex justify-end bg-white">
        <button
          @click="popup.closePopup()"
          class="px-6 py-2 rounded-lg bg-yellow-500 text-white font-medium
                 hover:bg-yellow-600 transition shadow flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          Done
        </button>
      </div>

    </div>
  </div>
</template>
