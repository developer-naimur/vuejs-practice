<template>

  <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>

    <form class="space-y-4">
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

      <button type="submit"
              class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
        Login
      </button>
    </form>

    <p class="mt-4 text-center text-gray-600">
      Don't have an account?
      <router-link to="/register" class="text-blue-600 hover:underline">Register</router-link>
    </p>
  </div>

</template>