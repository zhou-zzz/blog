---
title: JavaScript 作用域与闭包
date: 2024-11-01
tag: ['JavaScript']
description: 深入理解 JavaScript 中的作用域与闭包机制，提升代码质量和性能
---

# JavaScript 作用域与闭包

## 一、核心要点 🎯

### 1. 基础概念
- 定义：
  - 作用域：变量和函数的可访问范围,决定了代码中变量和其他资源的可见性
  - 闭包：函数及其对周围状态(词法环境)的引用的组合
- 应用场景：
  - 数据封装与私有化
  - 函数工厂和柯里化
  - 模块化设计模式
  - 异步编程中的状态保持
- 核心特性：
  - 词法作用域(静态作用域)
  - 变量提升机制
  - 作用域链向上查找
  - 闭包的记忆性

### 2. 工作原理
- 基本流程：
```javascript
// 1. 创建词法环境
function outer() {
  const x = 10
  function inner() {
    console.log(x) // 访问外部变量
  }
  return inner
}

// 2. 作用域链查找示例
const a = 1
function foo() {
  const b = 2
  function bar() {
    const c = 3
    console.log(a, b, c) // 逐级向上查找
  }
}
```

### 3. 最佳实践
✅ 推荐做法:
- 使用立即执行函数(IIFE)创建隔离作用域
- 及时清理不再使用的闭包
- 使用 Module 模式进行封装

❌ 避免做法:
- 避免在循环中直接创建函数
- 不要过度使用全局变量
- 避免创建过多的闭包

## 二、性能优化要点
- [ ] 使用 WeakMap/WeakSet 存储闭包数据
- [ ] 合理利用垃圾回收机制
- [ ] 优化作用域链的长度
- [ ] 避免闭包过度嵌套

## 三、调试技巧

### 1. 常见问题与解决方案
| 问题 | 解决方案 | 预防措施 |
|-----|---------|---------|
| 内存泄漏 | 手动解除引用 | 使用弱引用集合 |
| 变量污染 | 使用 IIFE | 严格模式 |
| 闭包性能 | 及时清理 | 合理设计结构 |

### 2. 代码示例
```javascript
// 优化前
function createItems() {
  const items = []
  for (var i = 0; i < 10; i++)
    items.push(() => { console.log(i) })

  return items
}

// 优化后
function createItems() {
  const items = []
  for (let i = 0; i < 10; i++) {
    items.push((function (num) {
      return function () { console.log(num) }
    })(i))
  }
  return items
}
