<template>
  <nav class="flex text-gray-600 text-sm mb-4" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <router-link to="/" class="inline-flex items-center text-gray-500 hover:text-gray-700">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L2 8h16L10 2z"/></svg>
          Home
        </router-link>
      </li>

      <li>
        <div class="flex items-center">
          <svg class="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L11.586 9 7.293 4.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
          <router-link to="/users" class="text-gray-500 hover:text-gray-700">Users</router-link>
        </div>
      </li>

      <li aria-current="page">
        <div class="flex items-center">
          <svg class="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L11.586 9 7.293 4.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-gray-700 font-medium">John Doe</span>
        </div>
      </li>
    </ol>
  </nav>
</template>
