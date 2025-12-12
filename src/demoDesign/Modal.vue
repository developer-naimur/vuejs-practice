<template>
  <div>
    <!-- Button to open modal -->
    <button @click="open = true"
      class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">
      Open Details
    </button>

    <!-- Modal Overlay -->
    <div v-if="open" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      
      <!-- Modal Container -->
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <!-- Close Button -->
        <button @click="open = false"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          ✕
        </button>

        <!-- Modal Header -->
        <h3 class="text-xl font-semibold text-gray-700 mb-4">User Details</h3>

        <!-- Modal Body -->
        <div class="space-y-4 max-h-[60vh] overflow-y-auto">
          <!-- Example: Single Data Table -->
          <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="px-4 py-2 font-medium text-gray-600">Full Name</td>
                <td class="px-4 py-2 text-gray-800">John Doe</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-medium text-gray-600">Email</td>
                <td class="px-4 py-2 text-gray-800">john@example.com</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-medium text-gray-600">Role</td>
                <td class="px-4 py-2 text-gray-800">Admin</td>
              </tr>
              <tr>
                <td class="px-4 py-2 font-medium text-gray-600">Status</td>
                <td class="px-4 py-2">
                  <span class="px-2 py-1 rounded-full text-white bg-green-500 text-sm">Active</span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Example: Form inside Modal -->
          <form class="space-y-3 mt-4">
            <div>
              <label class="block text-gray-600 mb-1">Update Name</label>
              <input type="text" placeholder="Enter new name"
                class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-gray-400 focus:outline-none" />
            </div>
            <div>
              <label class="block text-gray-600 mb-1">Update Role</label>
              <select
                class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-gray-400 focus:outline-none">
                <option>Admin</option>
                <option>User</option>
                <option>Manager</option>
              </select>
            </div>
            <button type="submit"
              class="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition mt-2">
              Save Changes
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>
