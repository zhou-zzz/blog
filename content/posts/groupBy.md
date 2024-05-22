---
title: 分组函数
date: 2022-12-5
tag: ['Ts']
description: 动手实现一个分组函数
---

## 关于分组函数的思考

起因：我想给博客的文章分个组
于是脑海里就开始构思出一份代码，拿到需要分组的key，用数组的reduce方法就可以了。
```ts
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
写完后，感觉生成这个代码的key太固定了，不够灵活，假如我想要按照年份分组的话那上边这个函数就不满足了，于是我又想着可以传个函数进去生成自己想要的key。
```ts
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
分组函数的功能不能只满足于一种情况，得既满足传简单字符串key又满足复杂自定义key的情况，最终代码如下：
```ts
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

## 总结
1、参数归一化，入参的key有两种一种字符串、一种函数，为了不改动后边的代码，把字符串key也变成一个函数。
