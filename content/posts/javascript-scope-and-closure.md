---
title: JavaScript 作用域与闭包
date: 2024-11-4
tag: ['Review']
description: 作用域与闭包
---

# JavaScript 作用域与闭包

## 一、作用域

### 1.词法作用域（静态作用域）
词法作用域（静态作用域）是 JavaScript 采用的作用域模式，它的作用域是在代码编写时就确定的。

```js
const val = 'global'
function foo() {
  const val = 'local'
  console.log(val) // local
  function bar() {
    console.log(val) // local 从上层作用域中找到
  }
  bar()
}
foo()
```

### 2.动态作用域
动态作用域是由函数调用时的调用栈决定的，而不是由函数定义的位置决定。

```js
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

### 3、块级作用域

ES6 引入了 `let` 和 `const` 关键字，它们可以在块级作用域中声明变量。块级作用域是指在代码块（如 `if` 语句、`for` 循环、`while` 循环等）中声明的变量，其作用域仅限于该代码块。

```js
if (true) {
  const blockVar = 'block scope'
}
console.log(blockVar) // ReferenceError: blockVar is not defined
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
```js
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
## 二、闭包深入解析
### 1. 闭包的定义和原理
闭包是指一个函数可以记住并访问其所在的词法作用域，即使该函数在其他地方执行。
```js
function createCounter() {
  let count = 0
  return function () {
    count++
    return count
  }
}
const counter = createCounter()
console.log(counter()) // 1
console.log(counter()) // 2
```
#### 代码执行过程分析

1. **创建阶段**
   - 调用 `createCounter()` 函数
   - 初始化局部变量 `count = 0`
   - 返回一个新的函数（内部函数）
   - 这个内部函数保持对 `count` 变量的引用

2. **内存中的状态**
   ```js
   counter = {
     [[Scope]]: { // 闭包的作用域链
       count: 0, // 私有变量
       // 其他外部环境的变量
     }
   }
   ```

3. **每次调用 counter()**
   - 访问闭包中的 `count` 变量
   - 对其进行自增操作
   - 返回新值
   - `count` 变量在内存中持续存在

#### 为什么这是闭包？

1. **形成条件**
   - 内部函数引用了外部函数的变量（`count`）
   - 内部函数被返回并在外部使用
   - 形成了一个闭包结构

2. **特点说明**
   - `count` 变量对外部完全隐藏
   - 只能通过返回的函数访问和修改
   - 每个闭包都有自己独立的作用域

3. **实际应用价值**
   ```javascript
   // 创建多个独立的计数器
   const counter1 = createCounter()
   const counter2 = createCounter()

   console.log(counter1()) // 1
   console.log(counter1()) // 2
   console.log(counter2()) // 1 (独立的计数器)
   ```
#### 闭包的优势

1. **数据私有化**
   - 外部无法直接访问 `count` 变量
   - 提供了数据封装的能力

2. **状态保持**
   - `count` 变量的值会被保持
   - 不会被垃圾回收机制回收

3. **模块化**
   - 可以创建独立的功能单元
   - 避免全局变量的污染

#### 最佳实践
1. 及时清除不再使用的闭包引用
```js
function foo() {
  const heavyData = Array.from({ length: 1000000 }).fill('data')
  return function () {
    return heavyData.length
  }
}
let heavyData = foo()
// 使用完及时清理
heavyData = null
```
2. 避免循环引用
```js
// bad
function foo() {
  const obj = {} // 创建一个对象
  function bar() { // 创建一个闭包函数
    console.log(obj) // 闭包吟咏了obj
  }
  obj.bar = bar // obj又引用了闭包
  return obj
}
const result = foo()
// 此时形成了循环引用：
// result.closure 引用了闭包函数
// 闭包函数引用了 obj
// obj 就是 result 本身
```
```
这里的问题是：
1. obj 引用了 bar
2. bar 又引用了 obj
3. 形成了相互引用的环
4. 即使不再使用 result，垃圾回收器也很难回收这些内存
```
```js
// good
function foo() {
  const obj = {}
  function bar() {
    console.log('需要的数据') // 不引用外部对象
  }
  return { // 返回新对象，避免循环引用
    bar
  }
}
```
```
好的做法的优点：
1. 没有相互引用
2. 闭包函数独立
3. 返回新对象而不是修改现有对象
4. 便于垃圾回收
```
3. 在适当的时机手动解除引用
```js
function setupHandler() {
  let element = document.getElementById('button')
  let heavyData = Array.from({ length: 1000000 })
  function handler() {
    console.log(heavyData.length)
  }
  element.addEventListener('click', handler)
  // 提供清理方法
  return function cleanup() {
    element.removeEventListener('click', handler)
    heavyData = null
    element = null
  }
}
// 使用
const cleanup = setupHandler()
// ... 当不再需要时
cleanup()
```
4. 使用 WeakMap/WeakSet 存储对象引用
```js
// 使用 WeakMap 存储私有数据
const privateData = new WeakMap()
class MyClass {
  constructor() {
    privateData.set(this, {
      count: 0,
      secret: 'sensitive data'
    })
  }

  increment() {
    const data = privateData.get(this)
    data.count++
    return data.count
  }
// 当实例被垃圾回收时，WeakMap 中的数据也会被自动回收
}
```
## 三、总结

1. 理解作用域的核心是掌握词法作用域规则
2. 合理使用块级作用域和 let/const
3. 闭包是 JavaScript 中强大的特性，但需要谨慎使用
4. 注意内存管理，防止内存泄漏
