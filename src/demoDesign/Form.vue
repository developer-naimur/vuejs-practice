<template>
  <!-- <div class="max-w-4xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg"> -->
  <div class="">
    <h2 class="text-3xl font-semibold mb-6 text-gray-800">User Information Form</h2>

    <form class="space-y-6">

      <!-- Full Name -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Full Name</label>
        <input type="text" placeholder="Enter full name"
          class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition" />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Email</label>
        <input type="email" placeholder="Enter email"
          class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition" />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Password</label>
        <input type="password" placeholder="Enter password"
          class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition" />
      </div>

      <!-- Age & Date -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Age</label>
          <input type="number" placeholder="Enter age"
            class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">Date of Birth</label>
          <input type="date"
            class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition" />
        </div>
      </div>

      <!-- Gender & Marital Status -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Gender</label>
          <select
            class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition">
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <span class="block text-gray-700 font-medium mb-1">Marital Status</span>
          <div class="flex gap-4 mt-1">
            <label class="flex items-center gap-2">
              <input type="radio" name="marital" class="form-radio text-gray-500" />
              Single
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="marital" class="form-radio text-gray-500" />
              Married
            </label>
          </div>
        </div>
      </div>

      <!-- Address -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Address</label>
        <textarea placeholder="Enter address"
          class="w-full border border-gray-300 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition resize-none"></textarea>
      </div>

      <!-- File Upload -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Upload Profile Picture</label>
        <input type="file" class="w-full text-gray-700" />
      </div>

      <!-- Terms & Notifications -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <label class="flex items-center gap-2">
          <input type="checkbox" class="form-checkbox text-gray-500" />
          Accept Terms and Conditions
        </label>

        <div class="flex items-center gap-2">
          <span class="text-gray-700">Enable Notifications</span>
          <input type="checkbox" class="toggle toggle-gray" />
        </div>
      </div>

      <!-- Submit -->
      <div>
        <button type="submit"
          class="w-full bg-gray-500 text-white font-semibold p-3 hover:bg-gray-600 transition shadow-sm">Submit</button>
      </div>
    </form>
  </div>
</template>

<style>
/* Toggle switch style */
.toggle {
  appearance: none;
  width: 40px;
  height: 20px;
  background: #d1d5db;
  border-radius: 9999px;
  position: relative;
  outline: none;
  cursor: pointer;
  transition: background 0.3s;
}
.toggle:checked {
  background: #7c3aed; /* gray-500 */
}
.toggle::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: 2px;
  left: 2px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
}
.toggle:checked::after {
  transform: translateX(20px);
}
</style>
