import axiosInstance from '@/axiosInstance'
import { useMessageStore } from '@/stores/useMessageStore'
import type { Ref } from 'vue'
import { watch } from 'vue'

export function useCustomerPriceGroup() {
  const messageStore = useMessageStore()

  const getCustomerPriceGroupId = (customerId: number, customers: any[] = []) => {
    const customer = customers.find(c => c.id === customerId)
    return customer?.price_group_id || null
  }

  const updateProductPricesByCustomer = async (
    customerId: number,
    customers: any[] = [],
    selectedProducts: any[] = [],
    forceUpdate = false
  ) => {
    if (!selectedProducts?.length) return

    const priceGroupId = getCustomerPriceGroupId(customerId, customers)
    if (!priceGroupId) return

    try {
      const res = await axiosInstance.post('/price-groups/prices/by-group', {
        price_group_id: priceGroupId,
        product_ids: selectedProducts.map(p => p.id),
      })

      const prices = res.data.data
      if (!prices?.length) return

      selectedProducts.forEach(p => {
        const matched = prices.find(pr => pr.product_id === p.id)
        if (matched) {
          // Only update if user did NOT manually edit
          if (!forceUpdate && p.manual_sale_price) return
          p.sale_price = Number(matched.price)
        }
      })
    } catch (err) {
      messageStore.showError('Failed to update product prices')
    }
  }

  const watchCustomerAndProducts = (
    rowRef: Ref<any>,
    customersRef: Ref<any[]>,
    selectedProductsRef: Ref<any[]>
  ) => {
    watch(
      [() => rowRef.value.customer_id, () => selectedProductsRef.value.length],
      ([customerId, newLen], [oldCustomerId, oldLen]) => {
        if (!customerId) return

        if (customerId !== oldCustomerId) {
          // Customer change -> force update all products
          updateProductPricesByCustomer(
            Number(customerId),
            customersRef.value || [],
            selectedProductsRef.value || [],
            true
          )
          return
        }

        if (newLen > oldLen) {
          // New product added -> only update new product
          updateProductPricesByCustomer(
            Number(customerId),
            customersRef.value || [],
            selectedProductsRef.value || [],
            false
          )
        }
      },
      { deep: true }
    )
  }

  return {
    getCustomerPriceGroupId,
    updateProductPricesByCustomer,
    watchCustomerAndProducts,
  }
}
