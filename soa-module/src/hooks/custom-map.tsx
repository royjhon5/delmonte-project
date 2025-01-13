export function customMap<T extends { id: string | number; name: string }>(data: T[] | undefined) {
    if (!data || !Array.isArray(data)) return []
    return data.map((item) => ({
      value: item.id,
      label: item.name,
    }))
}