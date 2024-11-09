---
title: 深入理解 JavaScript Event Loop
date: 2024-11-8
tag: ['Review', 'JavaScript']
description: 全面解析 JavaScript 事件循环机制，包含实战案例与性能优化指南
---

## 什么是事件循环？

事件循环（Event Loop）是 JavaScript 实现异步编程的核心机制。由于 JavaScript 是单线程语言，为了处理异步操作而不阻塞主线程，引入了事件循环机制。通过事件循环，JavaScript 能够高效地处理诸如网络请求、定时器、用户交互等异步操作。

## 事件循环的核心组成

### 1. 调用栈（Call Stack）
- 用于存放同步代码执行的地方
- 遵循"后进先出"（LIFO）原则
- 当调用栈为空时，才会去检查任务队列

### 2. 任务队列（Task Queue）
JavaScript 中的任务队列分为两种：

#### 宏任务（Macrotask）
- setTimeout/setInterval 回调
- DOM 事件回调
- AJAX 请求回调
- setImmediate（Node.js）

#### 微任务（Microtask）
- Promise.then/catch/finally 回调
- async/await（本质是 Promise）
- process.nextTick（Node.js）
- queueMicrotask

## 事件循环的执行顺序

让我们通过一个实例来理解事件循环的执行顺序：

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

执行过程说明：
1. 首先执行所有同步代码（打印 1 和 4）
2. 检查微任务队列，执行所有微任务（打印 3）
3. 执行一个宏任务（打印 2）

## async/await 的执行顺序

async/await 是 Promise 的语法糖，我们来看一个更复杂的例子：

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

## 事件循环的执行规则

1. 执行所有同步代码
2. 检查微任务队列，如果有微任务则执行完所有微任务
3. 执行一个宏任务
4. 重复步骤 2-3

## 性能优化建议

在实际开发中，需要注意以下几点来优化事件循环的性能：

1. **避免阻塞**
   - 不要在循环中使用 await
   - 将大量计算任务分割成小块
   - 使用 Web Workers 处理耗时操作

2. **合理使用并发**
   - 使用 Promise.all 处理并行任务
   - 避免不必要的串行操作

3. **优化定时器**
   - 合理设置定时器间隔
   - 注意定时器嵌套可能导致的性能问题

4. **动画优化**
   - 使用 requestAnimationFrame 代替 setTimeout
   - 适当使用 CSS 动画

## 注意事项

1. 微任务总是比宏任务优先执行
2. await 之后的代码会被转换为微任务
3. 每执行完一个宏任务，都会检查微任务队列
4. 定时器的延迟时间不是确切的，因为要等待调用栈清空

## 总结

理解事件循环机制对于编写高效的异步代码至关重要。通过合理利用宏任务和微任务的执行顺序，我们可以更好地控制代码的执行流程，提高应用性能。在实际开发中，建议根据具体场景选择合适的异步处理方式，并注意避免常见的性能陷阱。
