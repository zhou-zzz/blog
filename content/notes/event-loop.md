---
title: JavaScript 事件循环机制
date: 2024-11-8
tag: ['JavaScript']
description: 全面解析 JavaScript 事件循环机制，包含实战案例与性能优化指南
---

# JavaScript 异步编程

## 一、核心要点 🎯

### 1. 基础概念
- 定义：
  - 异步编程：非阻塞的执行方式，适用于 I/O 操作、网络请求等
  - Promise：异步操作的最终结果的代理对象
  - async/await：基于 Promise 的同步风格异步编程方案
- 应用场景：
  - 网络请求(AJAX/Fetch)
  - 文件操作(Node.js)
  - 定时器操作
- 核心特性：
  - Promise 状态不可逆
  - 异步任务队列管理
  - 错误传播机制

### 2. 工作原理
````javascript
// Promise 基本结构
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (/* 成功 */) {
    resolve(value)
  } else {
    reject(error)
  }
})

// async/await 原理
async function example() {
  try {
    const result = await promise
    return result
  } catch (error) {
    console.error(error)
  }
}
````

## 二、实践指南

### 1. Promise 链式调用
````javascript
// 实现一个请求队列
class RequestQueue {
  constructor() {
    this.queue = Promise.resolve()
  }

  addRequest(url) {
    this.queue = this.queue.then(() => {
      return fetch(url)
        .then(res => res.json())
        .catch((error) => {
          console.error(`请求 ${url} 失败:`, error)
          return null
        })
    })
    return this.queue
  }
}

// 使用示例
const queue = new RequestQueue()
queue.addRequest('/api/users')
  .then(users => console.log(users))
queue.addRequest('/api/posts')
  .then(posts => console.log(posts))
````

### 2. 异步任务控制
````javascript
// 并发控制器
class ConcurrencyManager {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent
    this.running = 0
    this.queue = []
  }

  async add(task) {
    if (this.running >= this.maxConcurrent) {
      // 等待队列
      await new Promise(resolve => this.queue.push(resolve))
    }

    this.running++
    try {
      return await task()
    }
    finally {
      this.running--
      if (this.queue.length > 0) {
        const next = this.queue.shift()
        next()
      }
    }
  }
}

// 使用示例
const manager = new ConcurrencyManager(2)
const tasks = [
  () => fetch('/api/1'),
  () => fetch('/api/2'),
  () => fetch('/api/3'),
  () => fetch('/api/4')
]

tasks.forEach((task) => {
  manager.add(task)
    .then(result => console.log('任务完成:', result))
    .catch(error => console.error('任务失败:', error))
})
````

### 3. 错误处理最佳实践
````javascript
// 全局错误处理
class AsyncError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
    this.name = 'AsyncError'
  }
}

async function safeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new AsyncError(
        `HTTP Error: ${response.status}`,
        response.status
      )
    }
    return await response.json()
  }
  catch (error) {
    if (error instanceof AsyncError) {
      // 处理已知错误
      handleKnownError(error)
    }
    else {
      // 处理未知错误
      handleUnknownError(error)
    }
    throw error
  }
}
````

## 三、性能优化

### 1. 缓存优化
````javascript
// 请求缓存装饰器
function cacheable(ttl = 5000) {
  const cache = new Map()

  return function (target, key, descriptor) {
    const original = descriptor.value

    descriptor.value = async function (...args) {
      const cacheKey = `${key}-${JSON.stringify(args)}`
      const cached = cache.get(cacheKey)

      if (cached && Date.now() - cached.timestamp < ttl)
        return cached.value

      const result = await original.apply(this, args)
      cache.set(cacheKey, {
        value: result,
        timestamp: Date.now()
      })

      return result
    }

    return descriptor
  }
}

// 使用示例
class UserService {
  @cacheable(10000)
  async getUser(id) {
    return await fetch(`/api/users/${id}`).then(r => r.json())
  }
}
````

### 2. 性能优化要点
- [ ] 合理使用并发控制
- [ ] 实现请求取消机制
- [ ] 添加超时处理
- [ ] 使用缓存减少请求

## 四、调试技巧

### 1. 常见问题
| 问题描述 | 解决方案 | 预防措施 |
|---------|---------|---------|
| Promise 未捕获 | 添加全局处理 | 使用 try/catch |
| 内存泄漏 | 及时清理引用 | 避免闭包累积 |
| 并发过载 | 限制并发数 | 使用队列控制 |

### 2. 调试工具
````javascript
// Promise 调试工具
class PromiseDebugger {
  static track(promise, name = 'Promise') {
    console.time(name)
    return promise
      .then((result) => {
        console.timeEnd(name)
        return result
      })
      .catch((error) => {
        console.timeEnd(name)
        console.error(`${name} failed:`, error)
        throw error
      })
  }
}

// 使用示例
PromiseDebugger.track(
  fetch('/api/data'),
  '数据请求'
)
````

## 五、面试重点

### 1. 核心考点
- Promise A+ 规范
- 事件循环机制
- async/await 原理
- 异步错误处理
- 并发控制实现

### 2. 手写题目
````javascript
// 实现 Promise.all
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    const results = []
    let completed = 0

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((result) => {
          results[index] = result
          completed++

          if (completed === promises.length)
            resolve(results)
        })
        .catch(reject)
    })
  })
}

// 实现 Promise.race
Promise.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      Promise.resolve(promise)
        .then(resolve)
        .catch(reject)
    })
  })
}
````
