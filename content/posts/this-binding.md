---
title: JavaScript this绑定
date: 2024-11-7
tag: ['Review']
description: this绑定
---

# JavaScript中的this绑定

## 一、this是什么
this是JavaScript中的一个关键字，它指的是当前执行上下文中的对象。this的值取决于函数调用的方式。

## 二、this的绑定规则

### 1、默认绑定
当函数独立调用时，this指向全局对象（非严格模式下） 或 undefined（严格模式下）。
```javascript
function foo() {
  console.log(this)
}
foo() // 非严格模式下指向window，严格模式下指向undefined
```
### 2、隐式绑定
当函数作为对象的方法调用时，this指向该对象。
```javascript
const obj = {
  name: 'Alice',
  sayHello() {
    console.log(this.name)
  }
}
obj.sayHello() // 输出Alice
```
### 3、显示绑定
通过call、apply、bind方法显示绑定this的指向。
```javascript
function introduce(age, hobby) {
  console.log(`我是${this.name}，今年${age}岁，爱好${hobby}`)
}

const person = { name: '李四' }

// call方式
introduce.call(person, 25, '读书')

// apply方式
introduce.apply(person, [25, '读书'])

// bind方式
const boundFn = introduce.bind(person)
boundFn(25, '读书')
```
### 4、new绑定
当函数作为构造函数调用时，this指向新创建的对象。
```javascript
function Person(name, age) {
  this.name = name
  this.age = age
}
const person = new Person('张三', 20)
console.log(person) // 输出Person { name: '张三', age: 20 }
```
### 5、箭头函数
箭头函数没有自己的this，而是从外部作用域继承this。
```javascript
const obj = {
  name: 'Alice',
  sayHello: () => {
    console.log(this.name)
  }
}
obj.sayHello() // 输出undefined
```
## 三、this绑定的优先级
new绑定 > 显式绑定 > 隐式绑定 > 默认绑定

## 四、手写实现call、apply、bind
### 1、手写实现call
```javascript
// 手写call示例
Function.prototype.myCall = function (context, ...args) {
  context = context || window // 如果没有传入context，默认使用全局对象（window）
  const fn = Symbol('fn') // 创建一个唯一的属性名，避免覆盖context上的已有属性
  context[fn] = this // 将当前函数（即调用myCall的函数）作为context对象的一个方法
  const result = context[fn](...args) // 使用展开运算符将参数传递给该方法并执行
  delete context[fn] // 删除临时添加的属性，清理context对象
  return result // 返回函数执行的结果
}
```
### 2、手写实现apply
```javascript
// 手写apply示例
Function.prototype.myApply = function (context, args) {
  context = context || window
  const fn = Symbol('fn')
  context[fn] = this
  const result = context[fn](...args)
  delete context[fn]
  return result
}
```
### 3、手写实现bind
```javascript
// 手写bind示例
Function.prototype.myBind = function (context, ...args) {
  const fn = this
  return function (...newArgs) {
    return fn.apply(context, [...args, ...newArgs])
  }
}
```
## 注意事项
1. 箭头函数不能用作构造函数
2. 事件处理函数中的this指向触发事件的元素
3. 严格模式下，默认绑定的this为undefined
4. bind返回的函数，无法通过call/apply改变this指向

## 实际应用场景
1. **回调函数中保持 this 指向**

   在回调函数中，`this` 的指向可能会丢失。可以使用 `bind` 方法来确保 `this` 指向正确的对象。

   ```javascript
   const obj = {
     name: '张三',
     greet() {
       setTimeout(() => {
         console.log(`你好，我是${this.name}`)
       }, 1000)
     }
   }

   obj.greet() // 1秒后输出：你好，我是张三
   ```

2. **事件处理函数**

   在事件处理函数中，`this` 默认指向触发事件的 DOM 元素。可以使用箭头函数或 `bind` 方法来改变 `this` 的指向。

   ```javascript
   const button = document.querySelector('button')

   button.addEventListener('click', function () {
     console.log(this) // 指向 button 元素
   })

   button.addEventListener('click', () => {
     console.log(this) // 指向外层作用域的 this
   })
   ```

3. **类的方法中使用 this**

   在类的方法中，`this` 通常指向类的实例。可以使用 `bind` 方法在构造函数中绑定 `this`，确保方法中的 `this` 始终指向实例。

   ```javascript
   class Person {
     constructor(name) {
       this.name = name
       this.sayHello = this.sayHello.bind(this)
     }

     sayHello() {
       console.log(`你好，我是${this.name}`)
     }
   }

   const person = new Person('李四')
   const greet = person.sayHello
   greet() // 输出：你好，我是李四
   ```

4. **React 类组件中的方法绑定**

   在 React 类组件中，通常需要在构造函数中绑定事件处理方法的 `this`，以确保方法中的 `this` 指向组件实例。

   ```javascript
   class MyComponent extends React.Component {
     constructor(props) {
       super(props)
       this.state = { count: 0 }
       this.handleClick = this.handleClick.bind(this)
     }

     handleClick() {
       this.setState({ count: this.state.count + 1 })
     }

     render() {
       return (
         <button onClick={this.handleClick}>
           点击次数：
           {this.state.count}
         </button>
       )
     }
   }
   ```
