export default function usePagination<T>(items: T[], pageSize: number) {
  const currentPage = ref(1)
  const totalPages = computed(() => Math.ceil(items.length / pageSize))

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return items.slice(start, end)
  })

  function nextPage() {
    if (currentPage.value < totalPages.value)
      currentPage.value++
  }

  function prevPage() {
    if (currentPage.value > 1)
      currentPage.value--
  }

  return {
    currentPage,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,
  }
}
