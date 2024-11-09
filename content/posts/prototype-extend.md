---
title: JavaScript 原型链与继承
date: 2024-11-5
tag: ['JavaScript', 'Review']
description: 深入理解 JavaScript 中的原型链机制与继承模式，掌握面向对象编程精髓
---

# JavaScript 原型链与继承

在 JavaScript 中，原型链和继承是实现面向对象编程的核心机制。通过深入理解这些概念，我们能够写出更优雅、可维护的代码。

![原型链基本概念](/imgs/prototype.png)
## 一、原型链详解

### 1、核心概念
每个 JavaScript 对象都隐藏着一些有趣的联系：
- 每个函数都有一个 `prototype` 属性，指向它的原型对象
- 每个对象都有一个 `__proto__` 属性，指向其构造函数的原型对象
- 原型对象也是普通对象，同样有自己的 `__proto__`

让我们通过一个简单的例子来理解：

```javascript
function Person(name) {
  this.name = name
}

Person.prototype.sayHello = function () {
  console.log(`你好，我是 ${this.name}`)
}

const person = new Person('张三')
console.log(person.__proto__ === Person.prototype) // true
console.log(Person.prototype.__proto__ === Object.prototype) // true
console.log(Object.prototype.__proto__ === null) // true
```

### 2、原型链查找机制
当我们访问一个对象的属性时，JavaScript 引擎会：
1. 首先在对象自身属性中查找
2. 如果找不到，就沿着 `__proto__` 向上查找
3. 直到找到属性或到达原型链顶端（null）

```javascript
const person = new Person('张三')
person.sayHello() // 在原型上找到方法
```

## 二、继承

### 1、原型链继承
```javascript
function Parent() {
  this.name = 'parent'
}
Parent.prototype.sayHello = function () {
  console.log('hello')
}
function Child() {
  this.name = 'child'
}
Child.prototype = new Parent()
Child.prototype.constructor = Child
const child = new Child()
child.sayHello() // hello
```

- 优点: 实现简单,父类方法可以复用
- 缺点: 所有实例共享父类实例属性,无法向父类构造函数传参

### 2、构造函数继承
```javascript
function Parent(name) {
  this.name = name
}
function Child(name) {
  Parent.call(this, name)
}
```
- 优点: 可以传参,不共享父类实例属性
- 缺点: 无法继承父类原型上的方法

### 3、组合继承
```javascript
function Parent(name) {
  this.name = name
}
Parent.prototype.getName = function () {
  return this.name
}
function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
Child.prototype = new Parent()
Child.prototype.constructor = Child
```
- 优点: 结合了原型链继承和构造函数继承的优点
- 缺点: 会调用两次父类构造函数、子类实例和原型上会有重复属性

### 4、寄生组合继承
```javascript
function Parent(name) {
  this.name = name
}
Parent.prototype.getName = function () {
  return this.name
}
function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
```
优点：
- 只调用一次父类构造函数
- 原型链保持不变
- 能够正常使用 instanceof 和 isPrototypeOf

### 5、ES6 类继承
```javascript
class Parent {
  constructor(name) {
    this.name = name
  }

  getName() {
    return this.name
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name)
    this.age = age
  }
}
```
优点：
- 语法简单，更接近传统语言的面向对象编程
- 继承链清晰，不会出现混淆
- 可以方便地使用 super 调用父类方法

ES6 class 继承的本质：
- 基于原型链的继承
- class只是语法糖
- extends实现了继承
- super关键字有两个作用：
  - 在constructor中调用父类构造函数
  - 在方法中指向父类原型对象

常见手写题
instacneof 实现
```javascript
function myInstacneof(left, right) {
  let proto = Object.getPrototypeOf(left)
  const prototype = right.prototype
  while (true) {
    if (!proto)
      return false
    if (proto === prototype)
      return true
    proto = Object.getPrototypeOf(proto)
  }
}
```
new操作符实现
```javascript
function myNew(fn, ...args) {
  if (typeof fn !== 'function')
    throw new TypeError('Type error')
  // 1.创建空对象,并将对象的原型指向构造函数的prototype
  const obj = Object.create(fn.prototype)
  // 2.将构造函数中的this指向obj,并执行构造函数
  const result = fn.apply(obj, args)
  // 3.如果构造函数返回的是对象,则返回构造函数返回的对象,否则返回obj
  return result
}
```

## 三、面试重点与实战

### 1. 经典面试题解析

#### 题目1：原型链判断
```javascript
function Person() {}
const person = new Person()

// 以下输出是什么？为什么？
console.log(person.__proto__ === Person.prototype)
console.log(Person.prototype.__proto__ === Object.prototype)
console.log(Person.__proto__ === Function.prototype)
```

> 🎯 考点分析：
> - 原型链的查找机制
> - 函数对象与普通对象的区别
> - `__proto__` 和 `prototype` 的关系

解答：
- 全部输出 `true`
- 原因：
  1. 实例的 `__proto__` 指向构造函数的 `prototype`
  2. `Person.prototype` 是普通对象，其 `__proto__` 指向 `Object.prototype`
  3. `Person` 作为函数对象，其 `__proto__` 指向 `Function.prototype`

#### 题目2：继承实现
```javascript
// 实现一个完美的继承
function inherit(Child, Parent) {
  // 1. 继承父类的原型
  Child.prototype = Object.create(Parent.prototype)

  // 2. 修复构造函数指向
  Child.prototype.constructor = Child

  // 3. 存储父类引用（可选）
  Child.super = Parent

  return Child
}

// 使用示例
function Parent(name) {
  this.name = name
}

Parent.prototype.sayName = function () {
  console.log(this.name)
}

function Child(name, age) {
  // 调用父类构造函数
  Parent.call(this, name)
  this.age = age
}

inherit(Child, Parent)

// 添加子类方法
Child.prototype.sayAge = function () {
  console.log(this.age)
}
```

### 2. 实际工作场景案例

#### a) 组件继承系统
```javascript
class Component {
  constructor(props) {
    this.props = props
    this.state = {}
  }

  setState(newState) {
    this.state = { ...this.state, ...newState }
    this.render()
  }

  render() {
    throw new Error('必须实现 render 方法')
  }
}

class Button extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPressed: false
    }
  }

  render() {
    return `<button class="${this.state.isPressed ? 'pressed' : ''}">${this.props.text}</button>`
  }
}
```

### 3. 调试技巧

#### 原型链调试方法
1. 使用 `console.dir()` 查看完整原型链
2. 使用 Chrome DevTools 的 Properties 面板
3. 使用 `Object.getPrototypeOf()` 代替 `__proto__`

#### 常见问题排查清单
- [ ] 检查 constructor 是否正确指向
- [ ] 验证原型链是否完整
- [ ] 确认方法调用的 this 指向
- [ ] 检查属性是否正确继承

### 4. 性能优化最佳实践

1. **避免原型链过长**
```javascript
// 👎 不推荐
class A {}
class B extends A {}
class C extends B {}
class D extends C {}

// 👍 推荐
class Base {}
class Feature1 extends Base {}
class Feature2 extends Base {}
```

2. **合理使用原型方法**
```javascript
// 👎 不推荐
class MyArray {
  constructor() {
    this.map = function (fn) { /* ... */ }
    this.filter = function (fn) { /* ... */ }
  }
}

// 👍 推荐
class MyArray {
  constructor() {
    // 实例属性放这里
  }

  map(fn) { /* ... */ }
  filter(fn) { /* ... */ }
}
```

### 5. 设计模式应用

#### 工厂模式与原型
```javascript
class ProductPrototype {
  clone() {
    return Object.create(this)
  }
}

class ProductFactory {
  constructor() {
    this.prototypes = new Map()
  }

  registerPrototype(key, proto) {
    this.prototypes.set(key, proto)
  }

  createProduct(key) {
    const proto = this.prototypes.get(key)
    return proto ? proto.clone() : null
  }
}
```

## 四、编码规范建议

1. 继承规范
   - 优先使用组合而非继承
   - 保持继承层级扁平
   - 明确定义接口和抽象方法

2. 原型使用规范
   - 避免直接操作 `__proto__`
   - 使用 `Object.create()` 创建对象
   - 合理划分实例属性和原型方法

3. 代码评审要点
   - 检查继承关系的合理性
   - 确认原型方法的共享性
   - 验证属性初始化的位置

> 🎯 面试重点总结：
> 1. 理解原型链工作机制
> 2. 掌握各种继承方式的优缺点
> 3. 能够实现完美继承
> 4. 了解 ES6 类继承的本质
> 5. 掌握原型链相关的性能优化
