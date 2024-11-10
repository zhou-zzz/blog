---
title: "ES6+ 核心特性全解析"
date: "2024-03-20"
description: "深入理解 ES6+ 的重要特性,助力前端进阶"
tags: ["JavaScript", "ES6", "Review"]
---

# ES6+ 核心特性全解析

## 1. 变量声明与作用域

### 1.1 let 和 const
- **块级作用域**
  ```javascript
  {
    const a = 1
    const b = 2
  }
  console.log(a) // ReferenceError
  console.log(b) // ReferenceError
  ```

- **暂时性死区(TDZ)**
  ```javascript
  console.log(a) // ReferenceError
  let a = 1
  ```

- **const 特性**
  ```javascript
  const obj = { name: '张三' }
  obj.name = '李四' // 允许
  obj = {} // TypeError
  ```

### 1.2 变量解构
```javascript
// 数组解构
const [a, b, ...rest] = [1, 2, 3, 4, 5]

// 对象解构
const { name, age = 18 } = person

// 嵌套解构
const {
  address: { city }
} = person
```

## 2. 函数增强

### 2.1 箭头函数
```javascript
// 基本语法
const sum = (a, b) => a + b

// this绑定
const obj = {
  data: [],
  init() {
    // 箭头函数绑定外层this
    fetch('/api/data')
      .then((data) => {
        this.data = data
      })
  }
}
```

### 2.2 参数默认值
```javascript
function request(url, method = 'GET', body = null) {
  // ...
}
```

## 3. 新数据结构

### 3.1 Map
```javascript
const map = new Map()
map.set('key', 'value')
map.set(obj, 'value') // 可以使用对象作为键

// 遍历
for (const [key, value] of map)
  console.log(key, value)
```

### 3.2 Set
```javascript
const set = new Set([1, 2, 2, 3])
console.log([...set]) // [1, 2, 3]

// 常用于数组去重
const unique = [...new Set(array)]
```

### 3.3 WeakMap 和 WeakSet
```javascript
const wm = new WeakMap()
let key = {}
wm.set(key, 'value')
key = null // key对象可被垃圾回收
```

## 4. 异步编程

### 4.1 Promise
```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('数据')
    }, 1000)
  })
}

// Promise链式调用
fetchData()
  .then(data => process(data))
  .catch(error => console.error(error))

// Promise并发
Promise.all([p1, p2, p3])
  .then(([result1, result2, result3]) => {
    // 处理所有结果
  })
```

### 4.2 async/await
```javascript
async function getData() {
  try {
    const result = await fetchData()
    return process(result)
  }
  catch (error) {
    console.error(error)
  }
}

// 并发控制
async function fetchAll() {
  const results = await Promise.all([
    fetch(url1),
    fetch(url2)
  ])
  return results
}
```

## 5. Class 语法

```javascript
class Person {
  static species = '人类'

  constructor(name) {
    this.name = name
  }

  static sayHello() {
    return 'Hello!'
  }

  get fullName() {
    return `${this.name} Smith`
  }

  sayName() {
    console.log(this.name)
  }
}

// 继承
class Employee extends Person {
  constructor(name, title) {
    super(name)
    this.title = title
  }
}
```

## 6. 模块化

```javascript
// 导出
// 导入
import defaultExport, { name, sayHello } from './module'
import * as module from './module'

export const name = '张三'
export function sayHello() {}
export default class {}

// 动态导入
async function loadModule() {
  const module = await import('./module')
}
```

## 7. 其他重要特性

### 7.1 Symbol
```javascript
const symbol = Symbol('description')
const obj = {
  [symbol]: 'value'
}
```

### 7.2 迭代器和生成器
```javascript
function* generator() {
  yield 1
  yield 2
  yield 3
}

const gen = generator()
console.log([...gen]) // [1, 2, 3]
```

## 8. 性能优化建议与实践

### 8.1 解构赋值优化
```javascript
// 🔴 避免过度解构
function processUser(user) {
  const { name, age, address, phone, email, preferences, settings, ...rest } = user
  // 只用到了name和age,但解构了所有属性
}

// ✅ 只解构需要的属性
function processUser(user) {
  const { name, age } = user
  // 更高效
}
```

### 8.2 展开运算符优化
```javascript
// 🔴 过度使用展开运算符
const newArray = [...array1, ...array2, ...array3, ...array4]

// ✅ 使用concat或push
const newArray = [].concat(array1, array2, array3, array4)
// 或
const newArray = array1.concat(array2, array3, array4)
```

### 8.3 async/await并发优化
```javascript
// 🔴 串行执行,性能差
async function fetchData() {
  const result1 = await fetch(url1)
  const result2 = await fetch(url2)
  const result3 = await fetch(url3)
  return [result1, result2, result3]
}

// ✅ 并行执行,性能好
async function fetchData() {
  const promises = [fetch(url1), fetch(url2), fetch(url3)]
  const [result1, result2, result3] = await Promise.all(promises)
  return [result1, result2, result3]
}
```

### 8.4 内存优化
```javascript
// 🔴 可能造成内存泄露
const cache = new Map()
function processData(data) {
  cache.set(data, processResult)
}

// ✅ 使用WeakMap自动回收
const cache = new WeakMap()
function processData(data) {
  cache.set(data, processResult)
  // data对象不再使用时会被自动回收
}
```

## 9. 面试重点示例

### 9.1 let、const、var区别
```javascript
// 暂时性死区(TDZ)演示
console.log(a) // undefined (var存在变量提升)
console.log(b) // ReferenceError (let不存在变量提升)
var a = 1
let b = 2

// 块级作用域演示
{
  var x = 1 // 函数作用域
  const y = 2 // 块级作用域
}
console.log(x) // 1
console.log(y) // ReferenceError
```

### 9.2 Promise相关
```javascript
// Promise.all 与 Promise.race 对比
const p1 = new Promise(resolve => setTimeout(() => resolve('p1'), 1000))
const p2 = new Promise(resolve => setTimeout(() => resolve('p2'), 2000))

// Promise.all 等待所有完成
Promise.all([p1, p2]).then(([result1, result2]) => {
  console.log(result1, result2) // 2秒后输出: p1 p2
})

// Promise.race 只要有一个完成
Promise.race([p1, p2]).then((result) => {
  console.log(result) // 1秒后输出: p1
})

// Promise错误处理
async function handleErrors() {
  try {
    await Promise.reject(new Error('出错了'))
  }
  catch (error) {
    console.log('捕获到错误:', error.message)
  }
}
```

### 9.3 箭头函数特点
```javascript
const obj = {
  name: '张三',
  // 普通函数
  sayName1() {
    setTimeout(function () {
      console.log(this.name) // undefined (this指向window)
    }, 100)
  },
  // 箭头函数
  sayName2() {
    setTimeout(() => {
      console.log(this.name) // '张三' (this继承自外层作用域)
    }, 100)
  }
}
```

### 9.4 Class实现原理
```javascript
// ES6 Class
class Person {
  constructor(name) {
    this.name = name
  }

  sayName() {
    console.log(this.name)
  }
}

// 等同于ES5的原型实现
function Person(name) {
  this.name = name
}
Person.prototype.sayName = function () {
  console.log(this.name)
}

// 继承实现
class Employee extends Person {
  constructor(name, title) {
    super(name)
    this.title = title
  }
}
```

## 10. 参考资源

- [ECMAScript 6 入门](https://es6.ruanyifeng.com/){:target="_blank" rel="noopener noreferrer"}
- [MDN Web Docs](https://developer.mozilla.org/zh-CN/){:target="_blank" rel="noopener noreferrer"}
- [JavaScript.info](https://zh.javascript.info/){:target="_blank" rel="noopener noreferrer"}
