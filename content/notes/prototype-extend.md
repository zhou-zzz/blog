---
title: JavaScript 原型链与继承
date: 2024-11-5
tag: ['JavaScript']
description: 深入理解 JavaScript 中的原型链机制与继承模式，掌握面向对象编程精髓
---

# JavaScript 原型链与继承

## 一、核心要点 🎯

### 1. 基础概念
- 定义：
  - 原型(`prototype`): 函数特有属性,包含共享的属性和方法
  - 原型链: 对象通过`__proto__`串联的查找链条
  - 继承: 子类获取父类属性和方法的机制
- 应用场景：
  - 实现类的继承
  - 共享方法和属性
  - 实现面向对象编程
- 核心特性：
  - 属性查找机制
  - 原型链动态性
  - 继承的多种实现

### 2. 原型链详解
````javascript
// 核心原理展示
function Person(name) {
  this.name = name
}

Person.prototype.sayName = function () {
  console.log(this.name)
}

const person = new Person('张三')

// 原型链关系
console.log(person.__proto__ === Person.prototype) // true
console.log(Person.prototype.__proto__ === Object.prototype) // true
console.log(Object.prototype.__proto__ === null) // true

// 属性查找过程
person.sayName() // 在原型上查找到方法
person.toString() // 在 Object.prototype 上查找到方法
````

## 二、继承实现详解

### 1. 常见继承模式
````javascript
// 1. 原型链继承
function Animal() {
  this.colors = ['black', 'white']
}
Animal.prototype.getColors = function () {
  return this.colors
}

function Dog() {}
Dog.prototype = new Animal()
Dog.prototype.constructor = Dog

// 2. 构造函数继承
function Dog(name) {
  Animal.call(this)
  this.name = name
}

// 3. 寄生组合继承（推荐）
function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype)
  Child.prototype.constructor = Child
}

// 4. ES6 class继承
class Animal {
  constructor(color) {
    this.color = color
  }

  say() {
    console.log('动物在叫')
  }
}

class Dog extends Animal {
  constructor(color, name) {
    super(color)
    this.name = name
  }

  bark() {
    super.say()
    console.log('汪汪汪')
  }
}
````

### 2. 实战应用

#### a) 组件继承系统
````javascript
// 基础组件类
class Component {
  constructor(props = {}) {
    this.props = props
    this.state = {}
  }

  setState(newState) {
    this.state = { ...this.state, ...newState }
    this.render()
  }

  render() {
    throw new Error('必须实现render方法')
  }
}

// 按钮组件
class Button extends Component {
  constructor(props) {
    super(props)
    this.state = { isPressed: false }
  }

  render() {
    return `
      <button class="${this.state.isPressed ? 'pressed' : ''}">
        ${this.props.text}
      </button>
    `
  }
}
````

#### b) 工具函数实现
````javascript
// instanceof 实现
function myInstanceof(left, right) {
  if (typeof left !== 'object' || left === null)
    return false

  let proto = Object.getPrototypeOf(left)
  while (proto) {
    if (proto === right.prototype)
      return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}

// new 操作符实现
function myNew(Constructor, ...args) {
  // 1. 创建空对象并链接到原型
  const obj = Object.create(Constructor.prototype)

  // 2. 绑定this并执行构造函数
  const result = Constructor.apply(obj, args)

  // 3. 返回新对象
  return result instanceof Object ? result : obj
}
````

## 三、性能优化与最佳实践

### 1. 性能优化要点
- [ ] 避免深层原型链
- [ ] 合理使用继承
- [ ] 优化方法定义位置
````javascript
// 不推荐
class MyArray {
  constructor() {
    this.map = function (fn) { /* ... */ } // 每个实例都创建一个新函数
  }
}

// 推荐
class MyArray {
  map(fn) { /* ... */ } // 所有实例共享一个函数
}
````

### 2. 代码规范
✅ 推荐做法：
- 使用 ES6 class 语法
- 保持继承层级扁平
- 优先使用组合模式

❌ 避免做法：
- 修改内置对象原型
- 使用 `__proto__`
- 过度使用继承

## 四、面试重点

### 1. 高频面试题
````javascript
// 1. 原型链判断
function Foo() {}
const foo = new Foo()

console.log(foo.__proto__ === Foo.prototype) // true
console.log(Foo.prototype.__proto__ === Object.prototype) // true
console.log(Foo.__proto__ === Function.prototype) // true

// 2. 继承实现
class Animal {
  constructor(name) {
    this.name = name
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name)
    this.breed = breed
  }
}

// 3. 原型污染防护
const obj = {}
Object.freeze(Object.prototype)
````
