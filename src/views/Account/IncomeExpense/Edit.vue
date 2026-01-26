<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import { AxiosError } from 'axios'

import FormSkeleton from '@/components/Skeleton/Form-1.vue'
import Breadcrumb from '@/demoDesign/Breadcrumb.vue'
import AccountMenu from '@/components/inc/SubSidebar/AccountMenu.vue'
import { useMessageStore } from '@/stores/useMessageStore'

const messageStore = useMessageStore()
const route = useRoute()
const router = useRouter()

const rowId = route.params.id

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Income/Expenses', to: '/account/income-expense' },
  { label: 'Edit Income/Expense' }
]

const processing = ref(false)
const loading = ref(true)

/* ===============================
  SINGLE ROW STATE
================================ */
const row = ref()

/* ===============================
  FETCH TAX DATA
================================ */
const fetchRow = async () => {
  try {
    const res = await axiosInstance.get(`/other-income-expenses/${rowId}`)
    const data = res.data.data
    console.log(data)
    row.value = {
      transaction_date: data.date,
      mode: data.mode,
      type_id: data.type?.id || '',
      account_id: data.account?.id || '',
      tax_id: data.tax?.id || '',
      amount: data.amount,
      note: data.description,
    }
  } catch (err) {
    messageStore.showError('Failed to load row data')
    //router.push('/setting/tax')
  } finally {
    loading.value = false
  }
}

/* ===============================
  UPDATE TAX
================================ */
const submitUpdate = async () => {
  if (processing.value) return

  processing.value = true

  try {
    await axiosInstance.put(`/other-income-expenses/${rowId}`, row.value)
    messageStore.showSuccess('Row updated successfully!')
    router.push('/account/income-expense')
  } catch (err) {
    if (err instanceof AxiosError) {
      messageStore.showError(err.response?.data?.message || 'Update failed')
    } else {
      messageStore.showError('Unexpected error occurred')
    }
  } finally {
    processing.value = false
  }
}



//load accounts
const accounts = ref([])
const accountLoading = ref<boolean>(false);
const loadAccounts = async () => {
  loading.value = true
  accountLoading.value = true
  try {
    const res = await axiosInstance.get('/accounts/option/list')
    accounts.value = res.data.data
  } catch (err) {
    messageStore.showError('Account load failed. Please check permission.')
  } finally {
    accountLoading.value = false
    loading.value = false
  }
}

//load types
const types = ref([])
const typeLoading = ref<boolean>(false);
const loadTypes = async () => {
  loading.value = true
  typeLoading.value = true
  try {
    const res = await axiosInstance.get('/other-income-expense-types/option/list')
    types.value = res.data.data
  } catch (err) {
    messageStore.showError('Type load failed. Please check permission.')
  } finally {
    typeLoading.value = false
    loading.value = false
  }
}

//load taxes
const taxes = ref([])
const taxLoading = ref<boolean>(false);
const loadTaxes = async () => {
  loading.value = true
  taxLoading.value = true
  try {
    const res = await axiosInstance.get('/taxes/option/list')
    taxes.value = res.data.data
  } catch (err) {
    messageStore.showError('Tax load failed. Please check permission.')
  } finally {
    taxLoading.value = false
    loading.value = false
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
  fetchRow()
})

</script>

<template>
<div class="flex gap-4">

  <div class="hidden lg:block flex-none">
    <AccountMenu />
  </div>

  <div class="flex-1 lg:ml-[320px] p-4 space-y-6">

    <!-- Breadcrumb -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Title -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold text-gray-700">Edit Income/Expense</h2>

      <router-link
        to="/account/income-expense"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        View All
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <FormSkeleton :columns="3" :rows="2" />
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="submitUpdate" class="space-y-4">

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


      <button
        type="submit"
        :disabled="processing"
        class="w-full bg-gray-500 text-white font-semibold p-3 rounded
               hover:bg-gray-600 transition cursor-pointer
               disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ processing ? 'Updating...' : 'Update Income/Expense' }}
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
