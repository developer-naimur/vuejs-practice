<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-700">User Details</h2>
      <button
        class="bg-gray-500 text-white px-4 py-2 hover:bg-gray-600 transition">
        Edit
      </button>
    </div>

    <!-- User Info Card -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label class="block text-gray-500 font-medium mb-1">Full Name</label>
        <p class="text-gray-800 font-semibold">John Doe</p>
      </div>

      <div>
        <label class="block text-gray-500 font-medium mb-1">Email</label>
        <p class="text-gray-800 font-semibold">john@example.com</p>
      </div>

      <div>
        <label class="block text-gray-500 font-medium mb-1">Role</label>
        <p class="text-gray-800 font-semibold">Admin</p>
      </div>

      <div>
        <label class="block text-gray-500 font-medium mb-1">Status</label>
        <span class="px-2 py-1 rounded-full text-white bg-green-500 text-sm">Active</span>
      </div>

      <div>
        <label class="block text-gray-500 font-medium mb-1">Phone</label>
        <p class="text-gray-800 font-semibold">+1 234 567 890</p>
      </div>

      <div>
        <label class="block text-gray-500 font-medium mb-1">Date of Birth</label>
        <p class="text-gray-800 font-semibold">1990-05-15</p>
      </div>

      <div class="md:col-span-2">
        <label class="block text-gray-500 font-medium mb-1">Address</label>
        <p class="text-gray-800 font-semibold">
          123 Main Street, City, Country, ZIP Code
        </p>
      </div>
    </div>

    <!-- Additional Info / Activity -->
    <div>
      <h3 class="text-xl font-semibold mb-3 text-gray-700">Activity Log</h3>
      <ul class="border border-gray-200 divide-y divide-gray-200">
        <li class="px-4 py-2 flex justify-between hover:bg-gray-50 transition">
          <span>Logged in</span>
          <span class="text-gray-500 text-sm">2025-12-11 10:30 AM</span>
        </li>
        <li class="px-4 py-2 flex justify-between hover:bg-gray-50 transition">
          <span>Updated profile</span>
          <span class="text-gray-500 text-sm">2025-12-10 03:15 PM</span>
        </li>
        <li class="px-4 py-2 flex justify-between hover:bg-gray-50 transition">
          <span>Changed password</span>
          <span class="text-gray-500 text-sm">2025-12-09 01:20 PM</span>
        </li>
      </ul>
    </div>

    <!-- Back / Action Buttons -->
    <div class="mt-6 flex justify-end gap-3">
      <button
        class="px-4 py-2 border rounded hover:bg-gray-100 transition">
        Back
      </button>
      <button
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
        Delete
      </button>
    </div>
  </div>
</template>
