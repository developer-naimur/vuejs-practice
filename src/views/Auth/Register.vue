<template>
  <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
    <h2 class="text-2xl font-bold mb-6 text-center">Create an Account</h2>

    <form class="space-y-4">
      <div>
        <label class="block mb-1 font-medium" for="name">Full Name</label>
        <input type="text" id="name" placeholder="Enter your full name"
               class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      <div>
        <label class="block mb-1 font-medium" for="email">Email</label>
        <input type="email" id="email" placeholder="Enter your email"
               class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      <div>
        <label class="block mb-1 font-medium" for="password">Password</label>
        <input type="password" id="password" placeholder="Enter your password"
               class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      <div>
        <label class="block mb-1 font-medium" for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" placeholder="Confirm your password"
               class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      <button type="submit"
              class="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition">
        Register
      </button>
    </form>

    <p class="mt-4 text-center text-gray-600">
      Already have an account?
      <router-link to="/login" class="text-blue-600 hover:underline">Login</router-link>
    </p>
  </div>
</template>
