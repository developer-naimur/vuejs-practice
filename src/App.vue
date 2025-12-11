<template>
  <div id="app" class="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
    <nav class="mb-6 text-lg font-medium">
      <router-link to="/" class="text-blue-600 hover:text-blue-800">Home</router-link>
      <span> | </span>
      <router-link to="/about" class="text-blue-600 hover:text-blue-800">About</router-link>
    </nav>
    <router-view />
  </div>
</template>
