## es6的特性
- let & const 
- 常见的解构赋值
- 箭头函数 
- object.defineProperty / Reflect + proxy
- 数组的方法

## let-const

```js
// 以前声明变量 var
// 为什么要有let & const
// var 1.污染全局变量 (常见的作用域 window,function,with)
//     2.我们没有声明之前 会预先定义 变量提升
//     3.var 可以被定义多次
//     4.var 不能声明常量
//     5.var 默认不会产生作用域
```
```js
// let 不会污染全局变量 ，不存在变量提升,不能被重复定义(同一个作用域下不能重复定义)  
// let + {} 可以产生一个作用域，异步循环
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  });
}
``` 
```js
// var 不能声明常量 （不能更改的量） 不能改变空间
const obj = {};
obj.a = 100;
// const 只要这个变量不改变 就不要用let 就用const
``` 
###  let-const-demo
```js
//eg1
console.log(a)

var a = 1

// undefined

//eg2
console.log(a)

let a = 1

//  Cannot access 'a' before initialization

//eg3
var a = 1

window.a === 1

//eg4
 let a = 1
  {
   console.log(a)
   let a = 2  // 暂存死区
  }

//eg5
 for(var i = 0 ; i < 10; i++){
   setTimeout(() => {
     console.log(i)
   })
 }
 // 都是10 原因在于js执行机制

 for(var i = 0 ; i < 10; i++){
   (function(i){
     setTimeout(() => {
      console.log(i)
     })
   })(i) // IIFR 立即执行函数
 }

 for(let i = 0 ; i < 10; i++){
   setTimeout(() => {
     console.log(i)
   })
 }
//eg6

 const a = {}
 a = [] 
 a = {}
 //Assignment to constant variable.
 const a = {}
 a.b = 1 // 这个是可以得到
```
## destructions
```js
// 解构(key)赋值 ...(剩余运算符 , 展开运算符)
// 改名: 默认值=

let {name:name1,age,address="回龙观"} = {name:'zf',age:'10'}

console.log(name1,age,address)

//zf 10 回龙观

let [n,a] = ['zf',10]

console.log(n,a)
//zf 10

// 对象里面套数组 数组里套对象
let {school:{count}} = {school : {count:100}}
console.log(count)
```
```js
// 1)... 剩余运算符,只能放到最后一项
let [,...args] = ['珠峰','10','回龙观'];
let {name,...obj} = {name:'zf',age:10,address:'回龙观'};
console.log(obj);
```
```js
// 2) ... 方法传递参数连用,可以把对象或者数组展开
let r = Math.max(...[1,2,3,5]);
console.log(r);

let arr1 = [1,2];
let arr2 = [2,3];  // [...arr1,...arr2]

let obj1 = {name:{a:1}};
let obj2 = {age:10,name:{b:2}}; // {...obj1,...obj2}
mergeOptions(obj1,obj2) // {age:10,name:{a:1,b:2}}
// 实现一个方法 做一个 mergeOptions  Object.assign({})
console.log({...obj1,...obj2});
```
```js
// 对象的展开 数组的展开 浅拷贝
// 浅拷贝 拷贝的是引用地址 深拷贝 拷贝地址中的内容
// 数组中的slice
let arr = [1,2,3,[4]]; // slice是浅拷贝，截取的是引用地址
let newArr = arr.slice(3);
newArr[0][0] = 100;
console.log(arr); //[ 1, 2, 3, [ 100 ] ]

let obj = {name:'zf',age:{a:1}}
let newObj = {...obj}
newObj.age.a = 1000;
console.log(obj);
```
### destructions-demo
```js
let [,...args] = ['123','456','789']
console.log(args)
// [ '456', '789' ]
let [,...args,] = ['123','213','123']
console.log(args)
// Rest element must be last element

let {name,...obj} = {name:'zf',age:10,address:'回龙观'};
console.log(obj);
// { age: 10, address: '回龙观' }

[1,2,3,4]
let a = Math.max(...[1,2,3,5])
console.log(a)

//在全局作用域下用let 声明，没有挂载到window上面，而是挂载到自己的作用域下面

// 对象的展开 数组的展开 浅拷贝
let obj = {name:'zf',age:{a:1}}
let newObj = {...obj}
newObj.age.a = 1000 
console.log(obj)
//{ name: 'zf', age: { a: 1000 } }
```

## deepclone
```js
// 可以实现深拷贝
// let obj = {name:'zf',age:{count:10},r:undefined};
// // 借用了stringify转换成一个字符串 再将这个字符串 转换成对象
// let newObj = JSON.parse(JSON.stringify(obj));
// console.log(newObj); // 不支持函数 日期 正则 undefined
// 自己实现深拷贝 (类型判断) 递归 拷贝对象 (函数一般补拷贝)
```
```js
function deepClone(obj,hash = new WeakMap()){
  // null 和 undefined 在 == 号的情况下相等
  if(obj == undefined) return obj;
  // 数据类型 string number boolean symbol
  if(typeof obj !== 'object') return obj;
  // 正则 日期 typeof  对象
  if(obj instanceof RegExp) return new RegExp(obj);
  if(obj instanceof Date) return new Date(obj);
  // [] / {}  cloneObj
  let val = hash.get(obj); // 如果映射表中存在 直接将结果返回
  if(val){ // 递归要有终止条件 这个就是终止条件
      return val
  }
  let cloneObj = new obj.constructor; // 去当前传入对象的构造函数
  hash.set(obj,cloneObj); // 如果不存在就创建映射
  for(let key in obj){ // 无论是对象还是数组 都可以循环
      if(obj.hasOwnProperty(key)){ // 只要实例上的属性 
          // 有可能 当前每一项中 内部还是一个引用类型
          // 做一个映射关系 把他存起来
          // 数据结构 队列 栈 链表 集合set hash表 树 图
          cloneObj[key] = deepClone(obj[key],hash);
      }
  }
  return cloneObj;
}
```
```js
let obj = {a:1};
obj.b = obj;
console.log(deepClone(obj));
// let arr = [1,2,3,[4]]
// let newArr = deepClone(arr);
// newArr[3][0] = 100;
// let a = 1;
// {
//     console.log(a); // 不会像上级作用域下查找
//     let a = 1; // 这个a 已经在我们这个作用域绑定好了
// }
```


### deepclone-demo
```js
let obj = {name:'zf',age:{count:10}}

let newObj = JSON.parse(JSON.stringify(obj))

let obj = {name:'zf',age:{
    count:10,
    a:function(){},
    b:null,
    c:undefined,
    d:/D/
  }
}
let newObj = JSON.parse(JSON.stringify(obj))
console.log(newObj)
//{ name: 'zf', age: { count: 10, b: null, d: {} } }

function deepClone(obj){
  if(obj === undefined) return obj
  // typeof function  function // 用于判断函数
  if(typeof obj !== 'obj') return  obj
  if(obj instanceof RegExp) return new RegExp(obj)
  if(obj instanceof Date) return new Date(obj)
  let cloneObj = new obj.constructor
  for(let key in obj){
    // 无论是对象还是数组 都可以循环
    if(obj.hasOwnProperty(key)){
      // cloneObj[key] = obj[key]
      // 做一个映射关系 把它存起来
      // js数据结构 集合set hash表
      cloneObj[key] = deepClone(obj[key])
    }
  }
  return cloneObj
}

let r = /\d+/
let reg = deepClone(r)
console.log(reg == r)

// [1,2,3]
// {name:'123'}
// [1,2,3,[2]]
// {err:new Error('123')}
//[] / {}
// ([]) instanceof Object
// {} instanceof Object
// ({}).constructor
// ([]).constructor
// new Error

function A(){
  this.a = 1 ;
  this.b =2

}
```
```js
A.prototype.aa = function(){}
let a = new A()
console.log(a)
for(let key in a){
  console.log(a)
  if(a.hasOwnProperty(key)){
    console.log(key)
  }
}
```
## set-map
```js
// set代表的就是集合  map  hash表
// 集合就是不能有重复的项目 数组去重 new Set
// generator => iterator
// let set = new Set([1,2,3,3,2,1]); // 他的key 和值时一样的
// 无论什么数据类型 增删改查
// console.log(set.values());
// set.forEach(item => {
//     console.log(item);
// });

// 如何求两个数组 的并集  差集  交集
```
```js

let arr1 = [1,2,3];
let arr2 = [3,4,5]; // [...arr1,...arr2]
// set是可以被迭代的 [...set]
```
```js
// 1)并集
// let set = new Set([...arr1,...arr2]);
// let union = [...set];

// 2)交集
// let s1 = new Set(arr1);
// let s2 = new Set(arr2);
// let intersection = [...s1].filter(item=>{ // 1,2,3  如果返回true 就保留到新的数组中
//     return s2.has(item);
// })
// console.log(intersection);
```
```js
// 差集
let s1 = new Set(arr1);
let s2 = new Set(arr2);
let intersection = [...s1].filter(item=>{ // 1,2,3  如果返回true 就保留到新的数组中
    return !s2.has(item);
});
console.log(intersection);
```
```js
// Object.keys() Object.values() Object.entries()
// let obj = { //Symbol 11种方法  Reflect 13种
//     a:1,
//     b:2,
//     [Symbol()]: 1// 独一无二 将Symbol作为对象的key属性
// }
// console.log(obj);
// 我们可以通过这些es5 的方法 来获取值  默认对象 keys只能取普通的 不包括symbol,getOwnPropertySymbols只能取symbol
// 以后所有的Object.xxx 都会变成Reflect.xxx
// console.log(Reflect.ownKeys(obj));

// 元编程 改变 js的原有功能
```
### set-map-demo
```js
let obj = {
  a:1,
  b:2,
  s:Symbol()
}

console.log(Symbol() === Symbol())

let obj = {
  a:1,
  b:2,
  [Symbol()]:1
}
console.log(obj) //{ a: 1, b: 2, [Symbol()]: 1 }
console.log(Object.keys(obj)) // [ 'a', 'b' ]
console.log(Object.getOwnPropertySymbols(obj)) // [ Symbol() ]

// Reflect 包含了 keys+getOwnPropertySymbols
// 以后所有的Object.xxx 都会变成Reflect.xxx
console.log(Reflect.ownKeys(obj))

```