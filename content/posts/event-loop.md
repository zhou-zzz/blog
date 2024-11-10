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

## 四、DOM 更新与事件循环

### 1. DOM 更新时机
JavaScript 中的 DOM 更新与事件循环密切相关，遵循以下顺序：
1. 同步代码执行
2. 微任务队列清空
3. DOM 渲染
4. 宏任务执行

### 2. 基础示例
```javascript
console.log('1') // 同步代码

// DOM 更新
document.body.style.background = 'red'

Promise.resolve().then(() => {
  console.log('2') // 微任务
  // 再次 DOM 更新
  document.body.style.background = 'blue'
})

console.log('3') // 同步代码

// 输出顺序: 1 -> 3 -> 2
// DOM 只渲染一次，显示蓝色背景
```

### 3. 加载状态管理最佳实践
```javascript
class LoadingManager {
  constructor(element) {
    this.element = element
    this.states = ['加载中', '处理中', '完成']
    this.currentIndex = 0
  }

  start() {
    // 立即显示第一个状态
    this.updateState()

    // 使用 requestAnimationFrame 确保状态变化可见
    const animate = () => {
      if (this.currentIndex < this.states.length - 1) {
        requestAnimationFrame(() => {
          this.currentIndex++
          this.updateState()
          animate()
        })
      }
    }

    animate()
  }

  updateState() {
    this.element.textContent = this.states[this.currentIndex]
    this.element.classList.add('state-change')

    requestAnimationFrame(() => {
      this.element.classList.remove('state-change')
    })
  }
}
```

配套的 CSS 样式：
```css
.state-change {
  transition: all 0.3s ease;
  opacity: 0.8;
}
```

### 4. DOM 更新优化策略

#### a) 批量更新 DOM
```javascript
function batchUpdate() {
  const fragment = document.createDocumentFragment()

  Promise.resolve().then(() => {
    // 批量操作
    for (let i = 0; i < 100; i++) {
      const div = document.createElement('div')
      fragment.appendChild(div)
    }
    // 一次性更新 DOM
    document.body.appendChild(fragment)
  })
}
```

#### b) 使用 requestAnimationFrame
```javascript
function smoothUpdate() {
  // 第一步更新
  element.textContent = '加载中...'

  requestAnimationFrame(() => {
    // 确保第一步更新可见
    element.textContent = '处理中...'

    requestAnimationFrame(() => {
      // 最终更新
      element.textContent = '完成！'
    })
  })
}
```

#### c) CSS 类替代直接样式操作
```javascript
// 👎 不推荐
element.style.opacity = '0'
element.style.transform = 'translateX(100px)'

// 👍 推荐
element.classList.add('hide-element')
```

### 5. 注意事项
- 微任务总是在当前事件循环的 DOM 渲染之前执行
- 如果需要看到 DOM 更新的中间状态，使用 `requestAnimationFrame`
- 批量处理 DOM 更新可以提高性能
- 优先使用 CSS 类而不是直接操作样式
- 避免在微任务中进行大量 DOM 操作，可能阻塞渲染

## 五、性能优化策略

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

## 六、常见陷阱与解决方案

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

### 3. 内存泄漏问题
```javascript
// ❌ 可能造成内存泄漏
let heavyData = null
function processData() {
  heavyData = Array.from({ length: 1000000 })
  // 处理数据
}

// ✅ 及时清理内存
function processData() {
  const heavyData = Array.from({ length: 1000000 })
  // 处理数据
  heavyData = null // 处理完及时释放
}
```

## 七、实战应用与面试题

### 1. 实际工作场景案例

#### a) 异步任务队列管理
```javascript
class TaskQueue {
  constructor() {
    this.queue = []
    this.running = false
  }

  addTask(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject })
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

#### b) 性能优化：防抖与节流
```javascript
// 防抖
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

// 节流
function throttle(fn, delay) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}
```

### 2. 经典面试题解析

#### 题目1：执行顺序预测
```javascript
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
async function foo() {
  console.log('4')
  await Promise.resolve()
  console.log('5')
}
foo()
console.log('6')

// 输出: 1 -> 4 -> 6 -> 3 -> 5 -> 2
```

#### 题目2：Promise 与 async/await
```javascript
async function example() {
  console.log('1')
  await Promise.resolve()
  console.log('2')
  setTimeout(() => console.log('3'), 0)
}

console.log('4')
example()
console.log('5')

// 输出: 4 -> 1 -> 5 -> 2 -> 3
```

## 八、性能优化最佳实践

### 1. 任务分割与优先级控制
```javascript
function chunkedTask(items, process) {
  const CHUNK_SIZE = 100
  let index = 0

  function doChunk() {
    const chunk = items.slice(index, index + CHUNK_SIZE)
    chunk.forEach(process)
    index += CHUNK_SIZE

    if (index < items.length)
      requestIdleCallback(() => doChunk())
  }

  doChunk()
}
```

### 2. 合理使用 requestAnimationFrame
```javascript
// 实现一个元素从左到右移动的平滑动画
function smoothMoveElement(element, distance) {
  let start = null
  const duration = 1000 // 动画持续1秒

  function animate(timestamp) {
    // 首次运行时初始化开始时间
    if (!start)
      start = timestamp

    // 计算动画进度（0 到 1 之间）
    const progress = Math.min((timestamp - start) / duration, 1)

    // 使用缓动函数使动画更自然
    const easeProgress = easeInOutCubic(progress)

    // 更新元素位置
    const currentPosition = distance * easeProgress
    element.style.transform = `translateX(${currentPosition}px)`

    // 如果动画未完成，继续下一帧
    if (progress < 1)
      requestAnimationFrame(animate)
  }

  // 缓动函数让动画更平滑
  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - (-2 * t + 2) ** 3 / 2
  }

  // 开始动画
  requestAnimationFrame(animate)
}

// 使用示例
const box = document.querySelector('.box')
smoothMoveElement(box, 300) // 元素向右移动300px

/**
 css
.box {
  width: 100px;
  height: 100px;
  background: #3498db;
  position: relative;
}
 */
```

> 🎯 面试重点总结：
> 1. 理解事件循环的运行机制
> 2. 掌握宏任务与微任务的区别
> 3. 能够准确预测代码执行顺序
> 4. 了解浏览器渲染时机
> 5. 掌握异步任务优化技巧
