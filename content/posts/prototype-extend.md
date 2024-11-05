---
title: JavaScript 原型链与继承
date: 2024-11-5
tag: ['Review']
description: 原型链与继承
---

# JavaScript 原型链与继承

## 一、原型链

### 1、基础概念
- 每个函数都有一个 `prototype` 属性,指向原型对象
- 每个对象都有一个 `__proto__` 属性,指向其构造函数的原型对象
- 原型对象也是普通对象,也有自己的 `__proto__`

![原型链基本概念](/imgs/prototype.png)

```javascript
function Person() {}
const person = new Person()
console.log(Person.prototype === person.__proto__) // true
```

### 2、原型链的查找
- 当访问对象属性时，如果对象本身没有这个属性
- 就会沿着__proto__向上查找，直到找到属性或者到达顶端null

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

## 三、总结

### 1. 原型链要点
- **原型对象关系**：
  - 函数有`prototype`属性指向原型对象
  - 对象有`__proto__`属性指向构造函数的原型对象
  - 形成了对象之间的继承链条
- **属性查找机制**：
  - 先在对象自身查找
  - 沿着`__proto__`向上查找
  - 直到找到属性或到达原型链顶端

### 2. 继承方案对比
| 继承方式 | 实现原理 | 特点 | 适用场景 |
|---------|---------|------|----------|
| 原型链继承 | 子类原型指向父类实例 | 属性共享，简单直接 | 了解原理 |
| 构造函数继承 | 在子类中调用父类构造函数 | 属性独立，可传参 | 需要独立属性 |
| 组合继承 | 结合上述两种方式 | 相对完善，但性能有损 | 常见实现 |
| 寄生组合继承 | 优化的组合继承 | 性能好，结构清晰 | 推荐使用 |
| ES6 class | 基于原型的语法糖 | 代码简洁，易维护 | 现代项目 |

### 3. 实践建议
1. **技术选择**
   - 新项目优先使用 ES6 class
   - 需要深度定制时考虑寄生组合继承
   - 避免使用简单原型链继承

2. **代码组织**
   - 保持继承层级扁平
   - 优先组合而非继承
   - 合理使用 super 调用父类方法

3. **性能考虑**
   - 避免重复创建方法
   - 注意属性初始化的位置
   - 合理使用原型链共享方法
