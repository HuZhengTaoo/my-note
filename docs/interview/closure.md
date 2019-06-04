[百度百科](https://baike.baidu.com/item/%E9%97%AD%E5%8C%85/10908873?fr=aladdin)

[mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

[一系列](http://xcx1024.com/ArtInfo/14190.html)

[闭包实际应用](https://juejin.im/post/5b1f36e6f265da6e1a603e34)

[reflect](http://tech.dianwoda.com/2017/08/09/jsde-fan-she-xue-xi-he-ying-yong/)

> 原型链： 面向对象，继承  是共享属性和方法，是可以实现继承的
> 原型链的方法是各个实例对象共享这个方法

> 闭包在定时器,事件监听器，ajax请求，跨窗口通信，web workers 或者其他异步或者同步任务，只要使用了回调函数都在使用闭包

> 闭包：涉及作用域查找机制，原型链，GC，上下文。
> 对变量和方法的封装，可以延迟使用外部变量和方法

## 概述

> mdn : 闭包是函数和声明该函数的词法环境的组合。

> you don't konw js : 当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行

```js
function init(){
  var name = 'kiko'
  function display(){
    console.log(name)
  }
  display()
}

init()

function makeFunc(){
  var name = 'koko'
  function displayName(){
    console.log(name)
  }
  return displayName
}
var myFunc = makeFunc()
myFunc()
```
> 闭包是函数和声明该函数的词法环境的组合。

> 这个环境包含了这个闭包创建时所能访问的所有局部变量

### 工厂函数
```js
//工厂函数实例
  function makeAdder(x){
    return function(y){
      return x + y
    }
  }

var add5 = makeAdder(5)
var add10 = makeAdder(10)
console.log(add5(2))
console.log(y)
console.log(add10(2))
```

```js
var Counter = (function(){
  var privateCounter = 0;
  function changeBy(val){
    privateCounter += val
  }
  return {
    increment:function(){
      changeBy(1)
    },
    decrements:function(){
      changeBy(-1)
    },
    value:function(){
      return privateCounter
    }
  }
})()

console.log(Counter.value()); /* logs 0 */
Counter.increment();
Counter.increment();
console.log(Counter.value()); /* logs 2 */
Counter.decrement();
console.log(Counter.value()); /* logs 1 */
```

```js
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}
MyObject.prototype.getName = function() {
  return this.name;
};
MyObject.prototype.getMessage = function() {
  return this.message;
};

var a = new MyObject(1,2)
console.log(a.getName())
```

## 闭包在模块中的应用

- 模块的简单示例

```js
function CoolModule(){
  var something = 'cool'
  var another = [1,3,4]
  function doSomething(){
    console.log(something)
  }
  function doAother(){
    console.log(another)
  }
  return {
    doSomething,
    doAother
  }
}
var xoo = CoolModule()
xoo.doSomething()
xoo.doAother()

console.log(Reflect.ownKeys(xoo))
//模块模式必备条件
//必须有外部的封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块实例）
//封闭函数必须返回一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有状态

// 最简单的单例模式模块
//模块模式 命令将要作为公共api返回的对象
```

```js
var foo = (function CoolModule(){
  var something = 'cool'
  var another = [1,2,3]
})()
```
> 闭包的函数去抖

```js
//闭包的函数去抖
window.onresize = debounce(fn,500)

function debounce(fn,timeLong){
  var timer = null
  return function(){
    if(timer){
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(function(){
      fn
    },timeLong)    
  }
}

function fn(){
  console.log('fn')
}
//普通去抖函数
window.onresize = function(){
  debounce(fn,timeLong)
}

var fn = function(){
  console.log('not closure')
}
//不用闭包，在函数执行完毕就会销毁，所以在dedounce函数外面再加一层，函数嵌套
time = ''
function dedounce () {
  if(time){
    clearTimeout(time)
    time = ''
  }
  time = setTimeout(function(){
    fn()
  },timeLong)
}
```

>  单例模式 基于类
```js
class CreateUser{
  constructor(name){
    this.name = name
    this.getName()
  }
  getName(){
    return this.name
  }
}
var ProxyMode = (function(){
  var instance = null
  return function(name){
    if(!instance){
      instance = new CreateUser()
    }
    return instance
  }
})

var a = ProxyMode('aaa')
var b = ProxyMode('bbb')
console.log(a===b) //true

// 基于普通函数

var CreateUser = (function(){
  var instance = null
  function CreateUser(name){
    var name = name
    function getName () {
      return name
    }
    return {
      name:name,
      getName:getName()
    }
  }
  return function(){
    if(!instance){
      instance = new CreateUser()
    }
    return  instance
  }
})()

var a = CreateUser('as')
var b = CreateUser('cc')
console.log(a===b)
```

> 申明独一id
```js
function closure(){
  let closure = (function(){
      var a = 1
      return function(){
        return a++
      }
  })(this)
  this.closure = closure
}
```
> 构建静态属性

```js
let _width = Symbol()
class Private{
  constructor(s){
    this[_width] = s
  }
  foo(){
    console.log(this[_width])
  }
}
var p  = new Private('50')
p.foo()
console.log(p[_width])  //可以访问到

let sque = (function(){
  let _width = Symbol()
  class Squery{
    constructor(s){
      this[_widht] = s
    }
    foo() {
      console.log(this[_width])
    }
  }
  return Squery
})()

let ss = new sque(20)
ss.foo()
console.log(ss[_width])

```
> 拿到正确值
```js
//原理是 声明了10个自执行函数，保存当时的值到内部
for(var i=0;i<10;i++){
  ((j)=>{
    setTimeout(function(){
      console.log(j)
    },1000)
  })(i)
}
//使用块级作用域解决
for(var i =0;i<10;i++){
  let j = i //闭包的块级作用域
  setTimeout(()=>{
    console.log(j)
  },1000)
}
// 变量在循环过程不止被声明一次
for(let i=0;i<10;i++){
  setTimeout(()=>{
    console.log(i)
  },100)
}
```
