type GroupByKey<T> = string | ((item: T) => string)

export function groupBy<T>(key: GroupByKey<T>, data: T[]): Map<string, T[]> {
  if (typeof key === 'string')
    key = (item: T) => (item as any)[key as string]
  return data.reduce((map, obj) => {
    const val = (key as (item: T) => string)(obj)
    const prev = map.get(val)
    if (prev)
      prev.push(obj)
    else
      map.set(val, [obj])
    return map
  }, new Map<string, T[]>())
}

export function getYear(item: { date?: string }) {
  return item.date!.slice(0, 4)
}
