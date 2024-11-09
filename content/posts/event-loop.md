---
title: JavaScript 事件循环机制
date: 2024-11-8
tag: ['JavaScript', 'Review']
description: 全面解析 JavaScript 事件循环机制，包含实战案例与性能优化指南
---

# JavaScript 事件循环机制

## 一、事件循环基础

### 1. 为什么需要事件循环？
JavaScript 是单线程语言，为了处理异步操作（如网络请求、定时器等）而不阻塞主线程，引入了事件循环机制。这使得 JavaScript 能够：
- 保持页面响应性
- 处理大量并发操作
- 提供良好的用户体验

### 2. 核心组成部分
事件循环由以下关键部分组成：

```javascript
// 示意图：事件循环的基本结构
/*
┌───────────────────────┐
│       调用栈          │
└─────────┬─────────────┘
          │
┌─────────┴─────────────┐
│      微任务队列        │
└─────────┬─────────────┘
          │
┌─────────┴─────────────┐
│      宏任务队列        │
└───────────────────────┘
*/
```

#### a) 调用栈（Call Stack）
- 存放同步代码执行的地方
- 遵循"后进先出"（LIFO）原则
- 当调用栈为空时，才会检查任务队列

#### b) 任务队列（Task Queue）
分为两种类型：

**宏任务（Macrotask）**：
- setTimeout/setInterval
- DOM 事件回调
- AJAX 请求回调
- setImmediate（Node.js）
- requestAnimationFrame（浏览器）

**微任务（Microtask）**：
- Promise.then/catch/finally
- async/await（本质是 Promise）
- process.nextTick（Node.js）
- queueMicrotask

## 二、执行顺序详解

### 1. 基本执行规则

```javascript
console.log('1') // 同步代码

setTimeout(() => {
  console.log('2') // 宏任务
}, 0)

Promise.resolve().then(() => {
  console.log('3') // 微任务
})

console.log('4') // 同步代码

// 输出顺序：1 -> 4 -> 3 -> 2
```

### 2. async/await 执行顺序

```javascript
async function example() {
  console.log('1') // 同步

  await Promise.resolve()
  console.log('2') // 微任务

  setTimeout(() => {
    console.log('3') // 宏任务
  }, 0)
}

console.log('4') // 同步
example()
console.log('5') // 同步

// 输出顺序：4 -> 1 -> 5 -> 2 -> 3
```

## 三、实际应用场景

### 1. 处理用户交互

```javascript
button.addEventListener('click', () => {
  // 宏任务：点击事件回调
  console.log('按钮被点击')

  Promise.resolve().then(() => {
    // 微任务：更新 UI 状态
    updateUI()
  })

  setTimeout(() => {
    // 宏任务：延迟操作
    showNotification()
  }, 1000)
})
```

### 2. 数据获取与处理

```javascript
async function fetchUserData() {
  try {
    console.log('开始获取数据') // 同步

    const response = await fetch('/api/user') // 宏任务
    console.log('数据获取完成') // 微任务

    Promise.resolve().then(() => {
      // 微任务：处理数据
      processData(response)
    })

    setTimeout(() => {
      // 宏任务：更新 UI
      updateUserInterface()
    }, 0)
  }
  catch (error) {
    console.error('错误：', error)
  }
}
```

## 四、性能优化策略

### 1. 避免阻塞主线程

```javascript
// ❌ 不好的实践
function heavyComputation() {
  for (let i = 0; i < 1000000; i++) {
    // 耗时操作
  }
}

// ✅ 优化后的代码
function chunkedComputation(start = 0) {
  const CHUNK_SIZE = 1000

  // 处理一小块数据
  for (let i = 0; i < CHUNK_SIZE && start + i < 1000000; i++) {
    // 处理数据
  }

  if (start + CHUNK_SIZE < 1000000) {
    // 使用宏任务分割处理过程
    setTimeout(() => {
      chunkedComputation(start + CHUNK_SIZE)
    }, 0)
  }
}
```

### 2. 合理使用微任务

```javascript
// ❌ 过度使用微任务
function processItems(items) {
  items.forEach((item) => {
    Promise.resolve().then(() => {
      processItem(item)
    })
  })
}

// ✅ 优化后的代码
async function processItems(items) {
  const BATCH_SIZE = 5

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE)
    await Promise.all(batch.map(processItem))
  }
}
```

## 五、常见陷阱与解决方案

### 1. 定时器延迟不准确

```javascript
// ❌ 不可靠的间隔
setInterval(() => {
  heavyTask()
}, 1000)

// ✅ 可靠的间隔
function reliableInterval(callback, interval) {
  let expected = Date.now() + interval

  function step() {
    const drift = Date.now() - expected
    callback()
    expected += interval

    setTimeout(step, Math.max(0, interval - drift))
  }

  setTimeout(step, interval)
}
```

### 2. 微任务阻塞渲染

```javascript
// ❌ 可能阻塞渲染
function updateUI() {
  Promise.resolve().then(() => {
    // 大量 DOM 操作
  })
}

// ✅ 使用 requestAnimationFrame
function updateUI() {
  requestAnimationFrame(() => {
    // DOM 操作会在下一帧执行
  })
}
```

## 六、总结

1. **事件循环的核心原则**：
   - 同步代码优先执行
   - 微任务优先于宏任务
   - 每个宏任务之后都会清空微任务队列

2. **最佳实践**：
   - 避免长时间占用主线程
   - 合理拆分大型任务
   - 适当使用微任务和宏任务

3. **性能优化要点**：
   - 使用任务分割
   - 避免过度使用微任务
   - 合理使用 requestAnimationFrame
   - 注意内存泄漏问题

## 五、面试重点与实战

### 1. 经典面试题解析

#### 题目1：执行顺序
```javascript
console.log('1')

setTimeout(() => {
  console.log('2')
}, 0)

Promise.resolve().then(() => {
  console.log('3')
})

async function foo() {
  console.log('4')
  await Promise.resolve()
  console.log('5')
}

foo()

console.log('6')
```

> 🎯 考点分析：
> - 宏任务与微任务的执行顺序
> - async/await 的执行机制
> - Promise 的处理时机

解答：
输出顺序：1 -> 4 -> 6 -> 3 -> 5 -> 2
原因：
1. 同步代码优先执行：1, 4, 6
2. 微任务队列执行：3, 5（await 后续代码进入微任务队列）
3. 宏任务队列执行：2

#### 题目2：定时器执行
```javascript
console.log('start')

setTimeout(() => {
  console.log('timeout 1')
  Promise.resolve().then(() => {
    console.log('promise in timeout')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('promise 1')
  setTimeout(() => {
    console.log('timeout 2')
  }, 0)
})

console.log('end')
```

解答：
输出顺序：start -> end -> promise 1 -> timeout 1 -> promise in timeout -> timeout 2

### 2. 实际工作场景案例

#### a) 性能优化：防抖实现
```javascript
function debounce(fn, delay) {
  let timer = null

  return function (...args) {
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 使用示例
const handleSearch = debounce((query) => {
  // API 请求
  fetch(`/api/search?q=${query}`)
}, 300)
```

#### b) 异步任务队列管理
```javascript
class TaskQueue {
  constructor() {
    this.queue = []
    this.running = false
  }

  addTask(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject
      })

      if (!this.running)
        this.run()
    })
  }

  async run() {
    this.running = true

    while (this.queue.length) {
      const { task, resolve, reject } = this.queue.shift()
      try {
        const result = await task()
        resolve(result)
      }
      catch (err) {
        reject(err)
      }
    }

    this.running = false
  }
}
```

### 3. 调试技巧

#### 事件循环可视化
```javascript
// 使用 async_hooks 模块追踪异步操作
const async_hooks = require('node:async_hooks')
const hook = async_hooks.createHook({
  init(asyncId, type) {
    console.log(`异步操作创建: ${type}`)
  },
  before(asyncId) {
    console.log(`异步操作开始: ${asyncId}`)
  },
  after(asyncId) {
    console.log(`异步操作结束: ${asyncId}`)
  }
})
```

#### 常见问题排查清单
- [ ] 检查任务优先级
- [ ] 验证微任务队列执行顺序
- [ ] 确认定时器延迟是否符合预期
- [ ] 检查异步操作的依赖关系

### 4. 性能优化最佳实践

1. **合理使用微任务**
```javascript
// 👎 不推荐
function badPractice() {
  Promise.resolve().then(() => {
    // 大量计算
    heavyComputation()
  })
}

// 👍 推荐
function goodPractice() {
  if (isIdle()) {
    requestIdleCallback(() => {
      heavyComputation()
    })
  }
  else {
    setTimeout(heavyComputation, 0)
  }
}
```

2. **避免任务阻塞**
```javascript
// 👎 不推荐
async function blockingOperation() {
  const results = []
  for (let i = 0; i < 1000000; i++)
    results.push(await heavyTask())
}

// 👍 推荐
async function nonBlockingOperation() {
  const tasks = Array(1000000).fill(heavyTask)
  const results = []

  for (let i = 0; i < tasks.length; i += 100) {
    const batch = tasks.slice(i, i + 100)
    results.push(...await Promise.all(batch))
    // 让出主线程
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}
```

## 六、扩展阅读

1. [Node.js 事件循环详解](链接)
2. [浏览器事件循环与渲染时机](链接)
3. [微任务队列的优化策略](链接)

## 七、编码规范建议

1. 异步代码规范
   - 优先使用 async/await
   - 合理划分任务优先级
   - 避免过深的回调嵌套

2. 性能考虑
   - 控制微任务队列大小
   - 避免长时间占用主线程
   - 合理使用批处理

3. 代码评审要点
   - 检查异步操作的错误处理
   - 验证任务执行顺序
   - 确认性能优化措施

> 🎯 面试重点总结：
> 1. 理解事件循环的运行机制
> 2. 掌握宏任务与微任务的区别
> 3. 能够准确预测代码执行顺序
> 4. 了解浏览器渲染时机
> 5. 掌握异步任务优化技巧
