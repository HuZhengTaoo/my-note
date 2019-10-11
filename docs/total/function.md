## function 概述

### 高阶函数(hf)

- 高阶函数：
- 1）你可以将函数当做另一个函数的参数传入
- 2) 如果一个函数 返回一个新的函数那么这个函数也是高阶函数
- 高阶函数的解决的问题 ：核心功能,封装起来 不对他进行更改

```js
//高阶函数
// 一个函数的参数是一个函数 回调
function a(){

}
a(()=>{

})
```

```js
// 一个函数返回一个函数 (拆分函数)
// 函数的before
// 希望将核心的逻辑提取出来，在外面增加功能
// 重写原型上的方法
// js的核心是 回调
Function.prototype.before = function(beforeFn){
  return (...args)=>{
    //箭头函数中没有this指向 没有arguments 所以会向上级作用域查找
    beforeFn()
    this(...args) // 展开运算符 say([1,2,3])
  }
}
```

```js
//面向AOP切片 编程 也是装饰器模式 把核心抽离 在核心基础上增加功能
const say = (...args) => { // 剩余运算符把所有的参数组成一个数组
  console.log('说话')
}
const newSay = say.before(()=>{
  console.log('你好')
})

const newSay1 = say.before(()=>{
  console.log('天气很好')
})
newSay1(1,2,3)
newSay()

// react 事务的改变 可以在前面和后面通知增加方法
``` 




 


### 事务 transaction
```js 
// setState 事务 setState 是同步还是异步
function perform(cb,arr){
    return function(){ // 这个不是洋葱模型
        arr.forEach(wrapper=>wrapper.initialize());
        cb();
        arr.forEach(wrapper=>wrapper.close());
    }
}
let newFunc = perform(function(){
    console.log('普通函数 核心功能')
},[ // 数组
    { // wrapper1
        initialize(){
            console.log('wrapper1 start')
        },
        close(){
            console.log('close1')
        }
    },
    { // wrapper2
        initialize(){
            console.log('wrapper2 start')
        },
        close(){
            console.log('close2')
        }
    }
])
newFunc();
// wrapper1 start,wrapper2 start  function close1 close2
```

### 函数科里化

- 函数柯里化 我需要把核心的功能 提出一个更细小的函数
-

```js 
 // 柯里化 我们可以把一个大函数拆分成很多个函数

 // 判断类型 Object.prototype.toString.call
 // 高阶函数中包含 科里化 可以保留参数 bind
//  console.log(Object.prototype.toString.call([]))

const checkType = (type) => {
  return (content) => {
    return Object.prototype.toString.call(content) === `[object ${type}]`
  }
}
// 闭包
let types = ['Number','String','Boolean']
let utils = {}
types.forEach(type=>{
  utils['is'+type] = checkType(type)
})

let isString = checkType('String')

console.log(utils.isString('123'))
console.log(utils.isNumber(123))

// 函数科里化怎么实现
const checkType = (type,content) => {
  return Object.prototype.toString.call(content) === `[object ${type}]`
}

// 通用科里化
const add = (a,b,c,d,e) => {
  return a+b+c+d+e
}

const curring = (fn,arr=[]) => {
  let len = fn.length
  return (...args)=>{ 
    arr = arr.concat(args) // [1] [1,2,3,4,5]
    if(arr.length < len){
      return curring(fn,arr)
    }
    return fn(...arr)
  }
}
let r = curring(add)(1,2)(3)(4,5) 
console.log(r)
// let fn = (a,b,c,d)=>{}
// fn.length === 4
``` 
### 科里化实践

```js 
const checkType = (type,content) => {
  return Object.prototype.toString.call(content) === `[object ${type}]`
}

let types = ['Number','String','Boolean']
let utils = {}
types.forEach(type=>{
  utils['is'+type] = curring(checkType)(type) //先传入一个参数
})

console.log(utils.isString('123'))
```
### 科里化处理事务

```js
// 事务 开始的时候 做某件事 结束的时候在做某件事

const perform = (anymethod,wrappers) =>{
  wrappers.forEach(wrap => {
    wrap.initilizae()
  })
  anymethod()
  wrappers.forEach(wrap => {
    wrap.close()
  })
}

perform (() => {
  console.log('说话')
},[
  {
    // wrapper
    initilizae(){
      console.log('您好')
    },
    close(){
      console.log('再见')
    }
  },
  {
    // wrapper
    initilizae(){
      console.log('您好1')
    },
    close(){
      console.log('再见2')
    }
  }
])

```

### 观察者模式

```js 
class Subject{
  //被观察者 小爸爸
  constructor(){
    this.arr = []
    this.state = '我开心'
  }
  attach(o){
    this.arr.push(o)
  }
  setState(newState){
    this.state = newState
    this.arr.forEach(o=>{
      o.update(newState)
    })
  }
}

class Observer{
  //观察者 我 我媳妇
  constructor(name){
    this.name = name
  }
  update(newState){
    console.log(this.name + '小宝宝:' + newState) 
  }
}

let s = new Subject('小宝宝')
let o1 = new Observer('我')
let o2 = new Observer('我媳妇')

s.attach(o1)
s.attach(o2)

s.setState('不开心')
``` 

### 发布订阅模式

```js
const fs = require('fs')
const path = require('path')
let school = {}
// 发布订阅模式
let e ={
  arr:[],
  on(fn){
    this.arr.push(fn)
  },
  emit(){
    this.arr.forEach(fn=>fn())
  }
}

e.on(()=>{ // 订阅
  console.log('ok')
})

e.on(()=>{
  if(Object.keys(school).length === 2){
    console.log(school)
  }
})

fs.readFile(path.resolve(__dirname, './name.txt') ,'utf8',(err,data)=>{
  school['name'] = data
  e.emit()
})
fs.readFile(path.resolve(__dirname, './age.txt') ,'utf8',(err,data)=>{
  school['age'] = data
  e.emit()
})

// 发布订阅模式 => 观察者模式 (vue watcher)

// 发布订阅者模式 发布者 和订阅者 两者没有直接关系 通过间接的arr直接桥梁

// 观察者模式 我家小宝宝 心情好

// 总结 发布和订阅之间无直接关系 观察者模式两者是有关系的

// 观察者模式包含发布订阅
```

### demo
```js
// 1) 我们希望读取数据 node 异步 会等待同步代码都执行完成后再执行

const fs = require('fs')
const path = require('path');
let school = {}
// 并发的问题 如何解决 计数器
// let index = 0
// function out(){
//   if(index === 2){
//     console.log(school)
//   }
// }

const after = (times,fn) => () => --times === 0 && fn()
let newAfter = after(2,()=>{
  console.log(school)
})


fs.readFile(path.resolve(__dirname, './name.txt') ,'utf8',(err,data)=>{
  school['name'] = data
  newAfter()
})
fs.readFile(path.resolve(__dirname, './age.txt') ,'utf8',(err,data)=>{
  school['age'] = data
  newAfter()
})


```
