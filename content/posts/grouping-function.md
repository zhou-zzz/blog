---
title: 分组函数
date: 2023-01-05
tag: ['Ts']
description: 动手实现一个分组函数
---

## 一、关于分组函数的思考

在管理博客文章时，我希望能够根据不同的属性对文章进行分组。最初，我使用了数组的 `reduce` 方法来实现这一功能。

```typescript
function groupBy<T>(key: string, data: T[]): Map<string, T[]> {
  return data.reduce((map, obj) => {
    const val = (obj as any)[key] // 获取key
    const prev = map.get(val)
    if (prev)
      prev.push(obj)
    else
      map.set(val, [obj])

    return map
  }, new Map<string, T[]>())
}

interface Post {
  title: string
  date: string
  type: string
}

const post: Post[] = [
  { title: 'x', date: '2022-1-1', type: 'ts' },
  { title: 'xx', date: '2022-2-1', type: 'vue' },
  { title: 'y', date: '2023-1-1', type: 'react' },
  { title: 'z', date: '2021-2-1', type: 'ts' },
]

const groupPost = groupBy<Post>('type', post)
// Map(3) {
//   'ts' => [
//     { title: 'x', date: '2022-1-1', type: 'ts' },
//     { title: 'z', date: '2021-2-1', type: 'ts' }
//   ],
//   'vue' => [ { title: 'xx', date: '2022-2-1', type: 'vue' } ],
//   'react' => [ { title: 'y', date: '2023-1-1', type: 'react' } ]
// }
```

然而，这种方法的分组 key 是固定的，无法满足按年份分组的需求。因此，我决定通过传入一个函数来自定义分组的 key。

```typescript
function groupBy<T>(key: (item: T) => string, data: T[]): Map<string, T[]> {
  return data.reduce((map, obj) => {
    const val = key(obj)
    const prev = map.get(val)
    if (prev)
      prev.push(obj)
    else
      map.set(val, [obj])

    return map
  }, new Map<string, T[]>())
}

function getYear(post: Post) {
  return post.date.slice(0, 4)
}

const groupPost = groupBy<Post>(getYear, post)
// Map(3) {
//   '2022' => [
//     { title: 'x', date: '2022-1-1', type: 'ts' },
//     { title: 'xx', date: '2022-2-1', type: 'vue' }
//   ],
//   '2023' => [ { title: 'y', date: '2023-1-1', type: 'react' } ],
//   '2021' => [ { title: 'z', date: '2021-2-1', type: 'ts' } ]
// }
```

为了让分组函数更加通用，我希望它既能接受简单的字符串 key，也能处理复杂的自定义 key。最终的实现如下：

```typescript
type GroupByKey<T> = string | ((item: T) => string)

function groupBy<T>(key: GroupByKey<T>, data: T[]): Map<string, T[]> {
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
```

## 二、总结

1. 参数归一化：通过将字符串 key 转换为函数，统一了参数的处理方式，简化了后续代码的实现。
