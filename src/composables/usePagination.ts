import { ref } from 'vue'

export function usePagination(defaultPerPage = 10) {
  const currentPage = ref(1)
  const perPage = ref(defaultPerPage)
  const lastPage = ref(1)
  const total = ref(0)

  const setMeta = (meta: any) => {
    currentPage.value = meta.current_page
    perPage.value = meta.per_page
    lastPage.value = meta.last_page
    total.value = meta.total
  }

  const changePage = (page: number, callback: () => void) => {
    if (page < 1 || page > lastPage.value) return
    currentPage.value = page
    callback()
  }

  const reset = (callback?: () => void) => {
    currentPage.value = 1
    callback && callback()
  }

  return {
    currentPage,
    perPage,
    lastPage,
    total,
    setMeta,
    changePage,
    reset,
  }
}
