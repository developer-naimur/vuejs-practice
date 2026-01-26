<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FormSkeleton from '@/components/skeleton/Form-1.vue'
import AccountMenu from '@/components/inc/SubSidebar/AccountMenu.vue'
import { $routes, $labels } from '@/constants/accountIncomeExpense'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'

import { useMessageStore } from '@/stores/useMessageStore'
const messageStore = useMessageStore()

import { useRouter } from 'vue-router';
import axiosInstance from '@/axiosInstance';
import { AxiosError } from "axios";

import { useUserStore } from "@/stores/useUserStore";
const userStore = useUserStore();
const router = useRouter();

/* =====================================================
   BREADCRUMB
===================================================== */
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: $labels.plural_name, to: $routes.index },
  { label: 'Add New ' + $labels.singular_name, }
]

const getToday = () => {
  return new Date().toISOString().slice(0, 10);
}

/* =====================================================
   Add Row
===================================================== */
const newRows = ref([
  {
    mode: '',
    transaction_date: getToday(),
    type_id: '',
    account_id: '',
    tax_id: '',
    amount: '',
    note: ''
  }
])
const addField = () => {
  newRows.value.push({
    mode: '',
    transaction_date: getToday(),
    type_id: '',
    account_id: '',
    tax_id: '',
    amount: '',
    note: ''
  })
}


/* =====================================================
   Copy Row
===================================================== */
const copyField = (index) => {
  const copied = { ...newRows.value[index] }
  newRows.value.splice(index + 1, 0, copied)
}


/* =====================================================
   Remove Row
===================================================== */
const removeField = (index) => {
  if (newRows.value.length > 1) {
    newRows.value.splice(index, 1)
  }
}



/* =====================================================
   Submit Rows
===================================================== */


const processing = ref<boolean>(false);
const submitRows = async () => {

  if (processing.value) return; // next time submit disable when current is proccessing

  processing.value = true;

  try {
    await axiosInstance.post('/other-income-expenses', {
      rows: newRows.value
    });

    messageStore.showSuccess('Data has been created successfully!');

    newRows.value = [{
      mode: '',
      transaction_date: getToday(),
      type_id: '',
      account_id: '',
      tax_id: '',
      amount: '',
      note: ''
    }];

  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'An error occurred while creating rows.');
    } else {
      messageStore.showError('An unexpected error occurred.');
    }
  } finally {
    processing.value = false;
  }
};


//load accounts
const accounts = ref([])
const accountLoading = ref<boolean>(false);
const loadAccounts = async () => {
  processing.value = true
  accountLoading.value = true
  try {
    const res = await axiosInstance.get('/accounts/option/list')
    accounts.value = res.data.data
  } catch (err) {
    messageStore.showError('Account load failed. Please check permission.')
  } finally {
    accountLoading.value = false
    processing.value = false
  }
}

//load types
const types = ref([])
const typeLoading = ref<boolean>(false);
const loadTypes = async () => {
  processing.value = true
  typeLoading.value = true
  try {
    const res = await axiosInstance.get('/other-income-expense-types/option/list')
    types.value = res.data.data
  } catch (err) {
    messageStore.showError('Type load failed. Please check permission.')
  } finally {
    typeLoading.value = false
    processing.value = false
  }
}

//load taxes
const taxes = ref([])
const taxLoading = ref<boolean>(false);
const loadTaxes = async () => {
  processing.value = true
  taxLoading.value = true
  try {
    const res = await axiosInstance.get('/taxes/option/list')
    taxes.value = res.data.data
  } catch (err) {
    messageStore.showError('Tax load failed. Please check permission.')
  } finally {
    taxLoading.value = false
    processing.value = false
  }
}



import TypeCreateForm from '@/components/modals/incomeExpenseType/TypeCreateForm.vue'
const showTypeModal = ref(false)
const onTypeSaved = async () => {
  showTypeModal.value = false
  await loadTypes() // dropdown refresh
}

onMounted(() => {
  loadAccounts()
  loadTypes()
  loadTaxes()
})

</script>

<template>
<div class="flex gap-4">

  <div class="flex-none hidden lg:block">
    <AccountMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">

      <h2 class="text-2xl font-semibold text-gray-700">
        Add New {{ $labels.singular_name }}
      </h2>

      <div class="flex gap-2 flex-wrap">
        <router-link
          :to="$routes.index"
          class="flex items-center gap-2 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          View All
        </router-link>

        <router-link :to="$routes.trash" class="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
                     01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0
                     011-1h4a1 1 0 011 1v2" />
          </svg>
          Trash
        </router-link>

      </div>
    </div>

    <!-- FORM -->
    <form @submit.prevent="submitRows" class="space-y-4">

      <div
        v-for="(row, index) in newRows"
        :key="index"
        class="bg-white pb-5 border-b border-gray-200 transition relative space-y-4"
      >

        <!-- Row 1 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

          <!-- Date -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Date <span class="text-red-600">*</span>
            </label>
            <input
              v-model="row.transaction_date"
              type="date"
              class="w-full border p-3"
            />
          </div>

          <!-- Mode -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Mode <span class="text-red-600">*</span>
            </label>
            <select v-model="row.mode" class="w-full border p-3">
              <option value="">Select</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Type <span class="text-red-600">*</span>
            </label>
            <div class="flex gap-2">
              <select
                v-model="row.type_id"
                class="w-full border p-3"
                :disabled="typeLoading || !types.length"
              >
                <option value="">Select</option>
                <option v-for="type in types" :key="type.id" :value="type.id">
                  {{ type.type_name }}
                </option>
              </select>
              <button type="button"
                      @click="showTypeModal = true"
                      class="px-3 bg-blue-500 text-white rounded cursor-pointer">
                +
              </button>
            </div>
          </div>

          <!-- Account -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Account <span class="text-red-600">*</span>
            </label>
            <select
              v-model="row.account_id"
              class="w-full border p-3"
              :disabled="accountLoading || !accounts.length"
            >
              <option value="">Select</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.account_name }} <template v-if="account.account_number"> - {{ account.account_number }}</template>
              </option>
            </select>

          </div>
        </div>

        <!-- Row 2 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

          <!-- Tax -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Tax
            </label>
            <select
              v-model="row.tax_id"
              class="w-full border p-3"
              :disabled="taxLoading || !taxes.length"
            >
              <option value="">Select</option>
              <option v-for="tax in taxes" :key="tax.id" :value="tax.id">
                {{ tax.tax_name }}
              </option>
            </select>
          </div>

          <!-- Amount -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Amount <span class="text-red-600">*</span>
            </label>
            <input
              v-model="row.amount"
              type="number"
              placeholder="0.00"
              class="w-full border p-3"
            />
          </div>

          <!-- Note -->
          <div>
            <label class="block text-sm text-gray-600 mb-1">
              Note
            </label>
            <textarea
              v-model="row.note"
              rows="2"
              placeholder="Optional note"
              class="w-full border p-3"
            ></textarea>
          </div>
        </div>

        <!-- ACTION BUTTONS (SVG SAME AS BEFORE) -->
        <div class="w-36 flex gap-2">

          <!-- Remove -->
          <button
            type="button"
            @click="removeField(index)"
            :disabled="newRows.length === 1"
            class="w-12 h-12 flex items-center justify-center rounded-md
                   bg-red-100 text-red-600 hover:bg-red-600 hover:text-white
                   transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Copy -->
          <button
            v-if="index === newRows.length - 1"
            type="button"
            @click="copyField(index)"
            class="w-12 h-12 flex items-center justify-center rounded-md
                   bg-blue-500 text-white hover:bg-blue-600"
            title="Copy & Add"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2"/>
              <rect x="8" y="8" width="12" height="12" rx="2"/>
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 12v4m2-2h-4"/>
            </svg>
          </button>

          <!-- Add -->
          <button
            v-if="index === newRows.length - 1"
            type="button"
            @click="addField"
            class="w-12 h-12 flex items-center justify-center rounded-md
                   bg-green-500 text-white"
            title="Add"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 4v16m8-8H4"/>
            </svg>
          </button>

        </div>
      </div>

      <!-- Submit -->      
        <button
          type="submit"
          :disabled="processing"
          class="w-full bg-gray-500 text-white font-semibold p-3 hover:bg-gray-600 transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ processing ? 'Processing...' : 'Submit All ' + $labels.plural_name }}
        </button>


    </form>
  </div>



  <!-- modals -->
  <!-- Type modal -->
  <div v-if="showTypeModal"
     class="fixed inset-0 bg-black/50 flex items-center justify-center z-100">

    <div class="bg-white w-full max-w-xl rounded-xl p-6">

      <h3 class="text-lg font-semibold mb-4">Add New Type</h3>

      <TypeCreateForm
        @saved="onTypeSaved"
        @cancel="showTypeModal = false"
      />

    </div>
  </div>
  
</div>
</template>
