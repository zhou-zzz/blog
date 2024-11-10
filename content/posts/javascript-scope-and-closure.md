---
title: JavaScript 作用域与闭包
date: 2024-11-4
tag: ['JavaScript', 'Review']
description: 深入理解 JavaScript 中的作用域与闭包概念，掌握核心原理与实践技巧
---

# JavaScript 作用域与闭包

在 JavaScript 中，作用域和闭包是两个最基础且最重要的概念。理解它们不仅能帮助我们写出更好的代码，还能避免许多常见的陷阱。让我们通过实例深入理解这两个概念。

## 一、作用域详解

### 1. 词法作用域（静态作用域）
词法作用域是 JavaScript 采用的作用域模式，它的特点是作用域在代码编写时就已确定，与函数调用位置无关。这种机制让我们的代码更可预测、更易维护。

```javascript
const message = '你好，世界'
function outer() {
  const message = '你好，JavaScript'
  function inner() {
    // inner 函数可以访问 outer 的变量
    console.log(message) // 输出：'你好，JavaScript'
  }
  inner()
}
outer()
```

### 2. 动态作用域
动态作用域是由函数调用时的调用栈决定的，而不是由函数定义的位置决定。

```javascript
const value = '全局'
function foo() {
  console.log(value)
}
function bar() {
  const value = 'bar中'
  foo()
}
// 词法作用域下
bar() // 输出: "全局"
// 如果是动态作用域，会输出: "bar中"
```

这里详细解释为什么会输出"全局"：
为什么会输出"全局"？

1. **词法作用域规则（JavaScript采用）**：
   - 函数的作用域在函数定义时就确定了
   - 与函数在哪里调用无关
   - 取决于函数在代码中定义的位置

2. **foo 函数的作用域链**：
   - foo 函数定义在全局作用域
   - 当 foo 需要查找 value 时，会沿着它的作用域链查找
   - foo 的作用域链是：foo 函数作用域 -> 全局作用域

3. **bar 中的 value 对 foo 不可见**：
   - 虽然 foo 是在 bar 中调用的
   - 但 bar 中定义的 value 对 foo 来说是不可见的
   - foo 只能看到自己作用域链上的变量

### 3. 块级作用域的实际应用

块级作用域不仅提供了更好的变量隔离性，还能帮助我们避免常见的编程错误：

```javascript
// 👎 不好的实践
for (var i = 0; i < 3; i++)
  setTimeout(() => console.log(i), 1000) // 输出：3, 3, 3

/**
var i;  // i 被提升到当前函数作用域顶部
{
    i = 0; // var i = 0;
    while (i < 3) {
        console.log(i);
        i++;
    }
}
console.log(i); // 3 (循环结束后 i 仍然可访问)
 */

// 👍 推荐的做法
for (let i = 0; i < 3; i++)
  setTimeout(() => console.log(i), 1000) // 输出：0, 1, 2

/**
let 的情况相当于：
{
    let i = 0;
    setTimeout(() => console.log(i), 0);
}
{
    let i = 1;
    setTimeout(() => console.log(i), 0);
}
{
    let i = 2;
    setTimeout(() => console.log(i), 0);
}
 */
```

### 4. var/let/const 的区别

| 特性 | var | let | const |
|------|-----|-----|-------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | 是 | 否 | 否 |
| 重复声明 | 允许 | 不允许 | 不允许 |
| 修改值 | 可以 | 可以 | 不可以 |

### 5. 变量提升

变量提升是指在代码执行前，变量会被提升到其作用域的顶部。
```javascript
console.log(a) // undefined
var a = 1
// 等同于
var a
console.log(a) // undefined
a = 1

// let const 不存在变量提升
console.log(b) // ReferenceError: b is not defined
let b = 2
```
```javascript
console.log(a) // function a() { console.log('1') }
var a = 1
function a() {
  console.log('1')
}

// 等同于
// 1. 首先是函数声明提升
function a() {
  console.log('1')
}

// 2. 然后是变量声明提升（由于已经有同名函数，这个声明会被忽略）
var a

// 3. 代码按顺序执行
console.log(a) // 输出函数，因为此时 a 指向函数声明
a = 1 // 这里才是赋值操作
```

**JavaScript 的变量提升（Hoisting）和函数声明优先的规则**

## 二、闭包：强大而优雅的编程模式

### 1. 闭包的原理与形成过程

闭包（Closure）是 JavaScript 中最重要的概念之一，它指的是一个函数能够访问其词法作用域之外的变量的特性。

#### a) 形成原理
1. 函数在创建时会保存其词法作用域（Lexical Scope）
2. 当函数在其词法作用域之外执行时，仍然可以访问其词法作用域中的变量
3. 闭包通过函数对象的 `[[Environment]]` 属性保存对外部词法环境的引用

#### b) 基本示例
```javascript
function createCounter() {
  let count = 0 // 私有变量

  return {
    increment() {
      count++ // 访问词法作用域中的变量
      return count
    },
    getCount() {
      return count
    }
  }
}

const counter = createCounter()
console.log(counter.getCount()) // 0
console.log(counter.increment()) // 1
console.log(counter.increment()) // 2
```

#### c) 闭包形成的过程
1. `createCounter` 函数执行时创建新的词法环境，包含 `count` 变量
2. 返回的对象中的方法保持对该词法环境的引用
3. 即使 `createCounter` 执行完毕，其内部的 `count` 变量仍然存在
4. 通过返回的方法可以访问和修改 `count` 变量

### 2. 闭包的实际应用场景

#### a) 数据私有化
```javascript
function createUser(name) {
  let score = 0 // 私有变量

  return {
    getName: () => name,
    getScore: () => score,
    addScore: (points) => {
      score += points
      return score
    }
  }
}

const user = createUser('张三')
console.log(user.getName()) // '张三'
console.log(user.addScore(10)) // 10
console.log(user.getScore()) // 10
```

#### b) 函数工厂
```javascript
function multiply(x) {
  return function (y) {
    return x * y
  }
}

const multiplyByTwo = multiply(2)
const multiplyByTen = multiply(10)

console.log(multiplyByTwo(5)) // 10
console.log(multiplyByTen(5)) // 50
```

### 3. 闭包的优势

1. **数据私有化**
   - 外部无法直接访问 `count` 变量
   - 提供了数据封装的能力

2. **状态保持**
   - `count` 变量的值会被保持
   - 不会被垃圾回收机制回收

3. **模块化**
   - 可以创建独立的功能单元
   - 避免全局变量的污染

### 4. 闭包的内存管理最佳实践

```javascript
// 👍 推荐的清理模式
function createHandler() {
  const heavyData = Array.from({ length: 10000 })

  return {
    handler: () => {
      console.log(heavyData.length)
    },
    cleanup: () => {
      // 清理资源
      heavyData.length = 0
    }
  }
}

const { handler, cleanup } = createHandler()
// 使用完毕后清理
cleanup()
```

## 三、实践建议与注意事项

### 1. 合理使用闭包的最佳实践

#### a) 避免过度使用闭包
```javascript
// 👎 不推荐：每个元素都创建一个新的闭包
function createButtons() {
  const buttons = []
  for (let i = 0; i < 1000; i++) {
    const button = document.createElement('button')
    button.onclick = function () {
      console.log(`Button ${i} clicked`)
    }
    buttons.push(button)
  }
  return buttons
}

// 👍 推荐：使用事件委托，只创建一个闭包
function createButtons() {
  const container = document.createElement('div')
  const buttons = []

  // 事件委托，只需要一个事件处理器
  container.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const index = e.target.dataset.index
      console.log(`Button ${index} clicked`)
    }
  })

  for (let i = 0; i < 1000; i++) {
    const button = document.createElement('button')
    button.dataset.index = i
    buttons.push(button)
  }

  buttons.forEach(btn => container.appendChild(btn))
  return container
}
```

#### b) 内存管理示例
```javascript
// 👎 不推荐：容易造成内存泄漏
class ResourceManager {
  constructor() {
    this.resources = new Map()
  }

  loadResource(id) {
    const resource = { data: Array.from({ length: 10000 }).fill('大量数据') }
    this.resources.set(id, resource)

    // 这里的闭包会一直持有 resource 的引用
    return function () {
      return resource.data
    }
  }
  // 没有提供清理方法
}

// 👍 推荐：提供清理机制
class ResourceManager {
  constructor() {
    this.resources = new Map()
  }

  loadResource(id) {
    const resource = { data: Array.from({ length: 10000 }).fill('大量数据') }
    this.resources.set(id, resource)

    return {
      getData: () => resource.data,
      cleanup: () => {
        // 清理资源
        this.resources.delete(id)
        resource.data = null
      }
    }
  }
}
```

#### c) 作用域链优化
```javascript
// 👎 不推荐：作用域链过长，性能较差
const globalData = { /* 大量数据 */ }

function outer() {
  const outerData = { /* 更多数据 */ }

  function middle() {
    const middleData = { /* 更多数据 */ }

    function inner() {
      // 这里的闭包需要维护整个作用域链
      return globalData.value + outerData.value + middleData.value
    }

    return inner
  }

  return middle()
}

// 👍 推荐：只保留需要的数据
function createProcessor(globalData) {
  // 立即计算需要的值
  const necessaryValue = globalData.value

  return function process(input) {
    // 闭包只需要维护 necessaryValue
    return input + necessaryValue
  }
}
```

#### d) 使用 WeakMap 优化垃圾回收
```javascript
// 👍 推荐：使用 WeakMap 来存储相关数据
class DOMManager {
  constructor() {
    // WeakMap 允许键值对在不再使用时被垃圾回收
    this.elementData = new WeakMap()
  }

  attachData(element, data) {
    this.elementData.set(element, data)
  }

  removeElement(element) {
    // 当 element 被删除时，WeakMap 中对应的数据会自动被垃圾回收
    element.remove()
  }
}

// 使用示例
const manager = new DOMManager()
const div = document.createElement('div')
manager.attachData(div, { someData: '大量数据' })

// 当不再需要时
manager.removeElement(div)
// div 和相关数据会被自动垃圾回收
```

### 2. 性能优化关键点

1. **避免过度使用闭包**
   - 使用事件委托代替多个事件监听器
   - 只在必要时创建闭包

2. **及时清理资源**
   - 提供 cleanup 方法
   - 使用 WeakMap/WeakSet 存储关联数据

3. **优化作用域链**
   - 减少闭包中的变量引用
   - 只保留必要的数据

4. **合理使用垃圾回收**
   - 使用 WeakMap/WeakSet 存储对象引用
   - 及时解除不需要的引用

## 四、面试重点与实战

### 1. 经典面试题解析

#### 题目1：输出问题
```javascript
for (var i = 0; i < 5; i++)
  setTimeout(() => console.log(i), 0)
```

> 🎯 考点分析：
> - 变量提升与作用域
> - 事件循环机制
> - 闭包应用

解答：
- 输出结果：5, 5, 5, 5, 5
- 原因：
  1. var 声明的变量是函数作用域
  2. 循环结束时 i 已经变成 5
  3. setTimeout 回调在下一个事件循环执行
  4. 此时所有回调引用的都是同一个 i

正确写法：
```javascript
// 方法1：使用 let
for (let i = 0; i < 5; i++)
  setTimeout(() => console.log(i), 0)

// 方法2：使用闭包
for (let i = 0; i < 5; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 0)
  })(i)
}
```

#### 题目2：实现私有变量
```javascript
// 要求：实现一个计数器，外部无法直接访问计数值
function createCounter() {
  let count = 0
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  }
}

const counter = createCounter()
console.log(counter.getCount()) // 0
console.log(counter.increment()) // 1
console.log(counter.count) // undefined
```

### 2. 实际工作场景案例

#### a) 事件处理器的内存管理
```javascript
class EventManager {
  constructor() {
    // 使用 Map 创建三层数据结构：
    // Map(element => Map(eventType => Set(handlers)))
    this.handlers = new Map()
    /**
     Map (handlers)
    ├── element1 => Map
    │   ├── 'click' => Set[handler1, handler2]
    │   └── 'mouseover' => Set[handler3]
    └── element2 => Map
        └── 'click' => Set[handler4]
     */
  }

  addHandler(element, type, handler) {
    if (!this.handlers.has(element))
      this.handlers.set(element, new Map())

    const elementHandlers = this.handlers.get(element)
    if (!elementHandlers.has(type))
      elementHandlers.set(type, new Set())

    elementHandlers.get(type).add(handler)
    element.addEventListener(type, handler)
  }

  removeHandler(element, type) {
    if (this.handlers.has(element)) {
      const elementHandlers = this.handlers.get(element)
      if (elementHandlers.has(type)) {
        elementHandlers.get(type).forEach((handler) => {
          element.removeEventListener(type, handler)
        })
        elementHandlers.delete(type)
      }
      if (elementHandlers.size === 0)
        this.handlers.delete(element)
    }
  }
}
```

### 3. 调试技巧

#### Chrome DevTools 中观察闭包
1. 在 Sources 面板中设置断点
2. 在 Scope 窗格中查看 Closure 作用域
3. 使用 Memory 面板排查内存泄漏

#### 常见问题排查清单
- [ ] 检查闭包是否及时释放
- [ ] 验证变量作用域是否符合预期
- [ ] 确认事件监听器是否正确移除
- [ ] 检查循环中的闭包使用是否合理

### 4. 性能优化最佳实践

1. **避免闭包过度使用**
```javascript
// 👎 不推荐
function badPractice() {
  const heavyData = Array.from({ length: 10000 })
  return () => heavyData.length
}

// 👍 推荐
function goodPractice() {
  const length = Array.from({ length: 10000 }).length
  return () => length
}
```

2. **合理使用作用域链**
```javascript
// 👎 不推荐
function slowLoop() {
  const globalVar = window.someValue
  for (let i = 0; i < 1000; i++)
    console.log(globalVar)
}

// 👍 推荐
function fastLoop() {
  const globalVar = window.someValue
  const log = console.log
  for (let i = 0; i < 1000; i++)
    log(globalVar)
}
```
## 五、编码规范建议

1. 闭包命名规范
   - 使用动词+名词的形式
   - 表明闭包的用途
   - 避免过于简单的命名

2. 作用域使用规范
   - 优先使用块级作用域
   - 避免创建过多的闭包
   - 及时清理不需要的引用

3. 代码评审要点
   - 检查变量命名和作用域范围
   - 确认闭包的必要性
   - 验证内存管理策略

> 🎯 面试重点总结：
> 1. 理解作用域链和闭包原理
> 2. 掌握内存管理和性能优化
> 3. 能够结合实际场景应用
> 4. 了解常见陷阱和解决方案
