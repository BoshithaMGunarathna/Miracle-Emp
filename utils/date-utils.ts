export function isThisWeek(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))

  startOfWeek.setHours(0, 0, 0, 0)
  endOfWeek.setHours(23, 59, 59, 999)

  return date >= startOfWeek && date <= endOfWeek
}

export function sortData<T>(data: T[], sortBy: string): T[] {
  return [...data].sort((a, b) => {
    const aValue = (a as any)[sortBy]
    const bValue = (b as any)[sortBy]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue)
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return aValue.getTime() - bValue.getTime()
    }

    return String(aValue).localeCompare(String(bValue))
  })
}

export function filterData<T>(data: T[], searchTerm: string, filterBy: string, searchFields: string[]): T[] {
  let filtered = data

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter((item) =>
      searchFields.some((field) =>
        String((item as any)[field])
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    )
  }

  // Apply category filter
  if (filterBy && filterBy !== "all") {
    filtered = filtered.filter((item) => {
      if (filterBy === "this-week") {
        return isThisWeek((item as any).deadline || (item as any).endDate || (item as any).startDate)
      }
      return (item as any).status === filterBy || (item as any).type === filterBy
    })
  }

  return filtered
}
