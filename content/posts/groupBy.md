---
title: 分组函数
date: 2023-06-5
tag: ['TS']
description: 动手实现一个分组函数
---

## 分组函数

```ts
type GroupByKey<T> = string | ((item: T) => string)

function groupBy<T>(key: GroupByKey<T>, data: T[]): Map<string, T[]> {
  return data.reduce((map, obj) => {
    const val = typeof key === 'function' ? key(obj) : (obj as any)[key]
    const prev = map.get(val)
    if (prev)
      prev.push(obj)
    else
      map.set(val, [obj])
    return map
  }, new Map<string, T[]>())
}
```
