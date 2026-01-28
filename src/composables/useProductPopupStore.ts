import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import axiosInstance from '@/axiosInstance'

export const useProductPopupStore = defineStore('productPopup', () => {
  /* ================= STATE ================= */
  const open = ref(false)
  const loading = ref(false)
  const brandLoading = ref(false)

  const products = ref<any[]>([])
  const brands = ref<any[]>([])
  const selectedProducts = ref<any[]>([])

  const search = ref('')
  const brand_id = ref<string | number>('')

  /* ================= API ================= */

  const loadBrands = async () => {
    brandLoading.value = true
    try {
      const res = await axiosInstance.get('/product-brands/option/list')
      brands.value = res.data.data
    } finally {
      brandLoading.value = false
    }
  }

  const loadProducts = async () => {
    loading.value = true
    try {
      const res = await axiosInstance.get('/products/option/list', {
        params: {
          search: search.value,
          brand_id: brand_id.value,
        },
      })
      products.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  /* ================= ACTIONS ================= */

  function openPopup() {
    open.value = true
    loadBrands()
    loadProducts()
  }

  function closePopup() {
    open.value = false
  }

  function addProduct(product: any) {
    if (!selectedProducts.value.find(p => p.id === product.id)) {
      selectedProducts.value.push({ ...product, qty: 1 })
    }
  }

  function removeProduct(product: any) {
    selectedProducts.value = selectedProducts.value.filter(p => p.id !== product.id)
  }

  function updateQty(p: any, type: 'plus' | 'minus') {
    if (type === 'plus') p.qty++
    if (type === 'minus' && p.qty > 1) p.qty--
  }

  function resetFilters() {
    search.value = ''
    brand_id.value = ''
    loadProducts()
  }

  /* ================= WATCH (DEBOUNCE) ================= */
  let timer: any = null
  watch([search, brand_id], () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      loadProducts()
    }, 400)
  })

  return {
    open,
    loading,
    brandLoading,

    search,
    brand_id,

    products,
    brands,
    selectedProducts,

    openPopup,
    closePopup,
    addProduct,
    removeProduct,
    updateQty,
    resetFilters,
  }
})
