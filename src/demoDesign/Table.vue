<template>

  <br>
  <br>
  <br>
  <!-- <div class="max-w-full mx-auto p-6 bg-white rounded-lg shadow-lg"> -->
  <div class="">
    <h2 class="text-2xl font-semibold mb-4 text-gray-700">User Management</h2>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-4 items-center">
      <input type="text" placeholder="Search by name or email"
        class="border border-gray-300 rounded-md p-2 w-full md:w-1/3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition" />

      <select class="border border-gray-300 rounded-md p-2 w-full md:w-1/5 focus:ring-2 focus:ring-gray-500 focus:outline-none transition">
        <option value="">Select Role</option>
        <option>Admin</option>
        <option>User</option>
        <option>Manager</option>
      </select>

      <select class="border border-gray-300 rounded-md p-2 w-full md:w-1/5 focus:ring-2 focus:ring-gray-500 focus:outline-none transition">
        <option value="">Status</option>
        <option>Active</option>
        <option>Inactive</option>
        <option>Pending</option>
      </select>

      <input type="date"
        class="border border-gray-300 rounded-md p-2 w-full md:w-1/5 focus:ring-2 focus:ring-gray-500 focus:outline-none transition" />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left text-gray-700 font-medium">#</th>
            <th class="px-4 py-2 text-left text-gray-700 font-medium">Name</th>
            <th class="px-4 py-2 text-left text-gray-700 font-medium">Email</th>
            <th class="px-4 py-2 text-left text-gray-700 font-medium">Role</th>
            <th class="px-4 py-2 text-left text-gray-700 font-medium">Status</th>
            <th class="px-4 py-2 text-left text-gray-700 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2">1</td>
            <td class="px-4 py-2">John Doe</td>
            <td class="px-4 py-2">john@example.com</td>
            <td class="px-4 py-2">Admin</td>
            <td class="px-4 py-2">
              <span class="px-2 py-1 rounded-full text-white bg-green-500 text-sm">Active</span>
            </td>
            <td class="px-4 py-2 flex gap-2">
              <button class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition">Edit</button>
              <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Delete</button>
            </td>
          </tr>

          <tr class="hover:bg-gray-50 transition">
            <td class="px-4 py-2">2</td>
            <td class="px-4 py-2">Jane Smith</td>
            <td class="px-4 py-2">jane@example.com</td>
            <td class="px-4 py-2">User</td>
            <td class="px-4 py-2">
              <span class="px-2 py-1 rounded-full text-white bg-yellow-500 text-sm">Pending</span>
            </td>
            <td class="px-4 py-2 flex gap-2">
              <button class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition">Edit</button>
              <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Delete</button>
            </td>
          </tr>

          <!-- Add more rows as needed -->
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <div>
        Showing <span class="font-semibold">1</span> to <span class="font-semibold">10</span> of <span class="font-semibold">50</span> entries
      </div>

      <div class="flex gap-2">
        <button class="px-3 py-1 border rounded hover:bg-gray-100 transition">&laquo; Prev</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100 transition">1</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100 transition">2</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100 transition">3</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100 transition">Next &raquo;</button>
      </div>
    </div>
  </div>
</template>
