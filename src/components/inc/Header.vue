<template>
	<div class="fixed top-0 left-0 w-screen flex items-center gap-10 bg-gray-100 p-2 border-b border-gray-200" id="__header">
		 <div class="flex-none">
		 	<img class="w-24" src="/public/logo.png" alt="logo" />
		 </div>
		 <div class="flex-1 text-center">
		 	<div class="flex gap-4 items-center justify-end">

		      <router-link to="">
		        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/sales.png" alt="sales" />
		      </router-link>
		      <router-link to="">
		        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/purchase.png" alt="purchase" />
		      </router-link>
		       <router-link to="">
		        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/product.png" alt="product" />
		      </router-link>
		      <router-link to="">
		        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/stock.png" alt="stock" />
		      </router-link>
		      <router-link to="">
		        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/reports.png" alt="reports" />
		      </router-link>
		      <router-link to="">
		        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/accounts.png" alt="accounts" />
		      </router-link>
		      <router-link to="">
		        <img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/icons/settings.png" alt="settings" />
      		  </router-link>
		 	</div>
		 </div>
		 <div class="flex-none pr-3">
		 	<img class="bg-white border border-gray-300 rounded-full p-2 w-10 h-10" src="/public/profile.png" alt="logo" />
		 </div>
	</div>
</template>