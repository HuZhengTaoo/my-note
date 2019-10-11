
##  概述
```js
// 1 解决并发问题 (同步多个异步方法的执行结果)
// 2 链式调用的问题 (先获取name，通过name再获取age) 解决多个回调嵌套问题

// promise 是一个类
// 1 每次new 一个Promise 都需要传递一个执行器 执行器是立即执行的
// 2 执行器函数中有两个函数 resolve reject
// 3 默认Promise有三个状态 pendding 
// resolve 表示成功 fulfilled
// reject 就是拒绝 rejected
// 4 如果一旦成功了 不能变成失败 一旦失败 不能再成功 ，只有当前状态是pending的时候 才能更改状态
// 5 每个promise 都有一个then方法
let p = new Promise((resolve,reject)=>{
  resolve('我有钱')  // 走了resolve 就不会失败
  throw new Error('失败') // 如果抛出异常也会执行失败
})
// 没有完全解决回调问题
p.then(
  data=>{
  console.log('success',data)
  },
  err=>{
  console.log('error',err)
  }
)

//一个实例then多次
p.then(
  data=>{
  console.log('success',data)
  },
  err=>{
  console.log('error',err)
  }
)
p.then(
  data=>{
  console.log('success',data)
  },
  err=>{
  console.log('error',err)
  }
)
```
### 简单demo
```js
let  fs = require('fs')
let path = require('path')
// 原生的方法 都是通过函数的第一个参数来控制
// 如果需要改造成promise 就先将回调的方法 改造成promise

function readFile(...args){
  return new Promise((resolve, reject) => {
    fs.readFile(...args,function(err, data){
      if(err) reject(err);
      resolve(data);
    })
  })
}

// 链式调用 如果返回一个普通值 会走下一个then的成功
// 抛出错误 then失败的方法
// 如果是promise 就让promise执行采用他的状态
// 是返回一个新的promise 来实现链式调用
readFile(path.resolve(__dirname,'./age.txt'),'utf8').then(data=>{
  return readFile(data,'utf8')
}).then(data=>{
  console.log(data)
},err=>{
  console.log(err)
})


// promise链式调用
// 1) 普通值表示不是promise 也不是错误
// 2) 如果返回的是一个promise 那么这个promise会执行 并且采用他的状态
readFile(path.resolve(__dirname,'./age.txt'),'utf8').then(data=>{
  return data
},err=>{  
  console.log('s:'+err)
}).then(data=>{ // 想让下一个then走失败 
  console.log(data)  // 需要 1） 返回一个失败的promise 抛出一个异常
  return new Promise((resolve, reject)=>{
    reject('error')
  })
  // throw new Error('失败')
})
.then(data=>{
  console.log(data)
},err=>{
  console.log(err)
})




// fs.readFile(path.resolve(__dirname, './name.txt'),'utf8',(err,data)=>{
//   if(err){
//     return console.log(err)
//   }
//   fs.readFile(data,'utf8',(err,data)=>{
//     if(err){
//       return console.log(err)
//     }
//     console.log(data)
//   })
// })
``` 

## 自己的promise
```js 
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
class Promise {
  constructor(executor) {
    //创建 promise executor 就会立即执行
    this.value = undefined;
    this.reason = undefined;
    this.status = PENDING;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = REJECTED;
        this.onResolvedCallbacks.forEach(fn => fn())  // 发布 有可能resolve 在then的后面
        //执行，此时先将方法存放起来，到时候成功了一次执行这些回调
      }
    };
    let reject = reason => {
      if(this.status === PENDING){
        this.reason = reason;
        this.status = FULFILLED;
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    };
    
    // 这里可能发生异常
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  // then 方法会判断当前的状态
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
    if (this.status === PENDING) {
      this.onResolvedCallbacks.push(()=>{
        // todo ...
        onFulfilled(this.value);
      })
      this.onRejectedCallbacks.push(()=>{
        onRejected(this.reason)
      })
    }
  }
}
module.exports = Promise

``` 
### 引用自己的promise

```js
let Promise = require('./promise2')

let p = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve('ok')
    // throw new Error('失败')
  },2000)
})
//多个then，并且是异步就是发布订阅模式
p.then(data=>{
  console.log(data,'success')
},err=>{
  console.log(err,'error')
})
p.then(data=>{
  console.log(data,'success')
},err=>{
  console.log(err,'error')
})
p.then(data=>{
  console.log(data,'success')
},err=>{
  console.log(err,'error')
})
```

## note

从0到1完美诠释异步编程。 **实现Promise**:https://promisesaplus.com/

- 掌握高阶函数的使用，使用高阶函数解决异步问题。

- 掌握发布订阅模式和观察者模式

- 掌握promise核心应用，使用promise解决异步编程问题

- 实现一个完整的promise库

- 掌握promise中常见的面试题

- 扩展promise中常见方法 all,race,finnaly...

- 掌握generator的使用以及co库的应用 

- 异步终极解决方案async+await

###  关于函数

- 什么是高阶函数?    before函数  react事务 / type / after函数

  把函数作为参数或者返回值的一类函数。

- AOP (装饰模式) 

  AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，其实就是给原函数增加一层，不用管原函数内部实现

  ```
   *                       wrappers (injected at creation time)
   *                                      +        +
   *                                      |        |
   *                    +-----------------|--------|--------------+
   *                    |                 v        |              |
   *                    |      +---------------+   |              |
   *                    |   +--|    wrapper1   |---|----+         |
   *                    |   |  +---------------+   v    |         |
   *                    |   |          +-------------+  |         |
   *                    |   |     +----|   wrapper2  |--------+   |
   *                    |   |     |    +-------------+  |     |   |
   *                    |   |     |                     |     |   |
   *                    |   v     v                     v     v   | wrapper
   *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
   * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
   * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
   *                    | |   | |   |   |         |   |   | |   | |
   *                    | |   | |   |   |         |   |   | |   | |
   *                    | |   | |   |   |         |   |   | |   | |
   *                    | +---+ +---+   +---------+   +---+ +---+ |
   *                    |  initialize                    close    |
   *                    +-----------------------------------------+
   * 
  ```

- 发布订阅模式 、 观察者模式 (events on emit)

  一种一对多的关系，发布者和订阅者是否有关联，观察者模式基于发布订阅模式



### promise面试

- promise 中的链式调用如何中断?

- Promise.finally实现原理?  

- promise有哪些缺点？fetch 无法中断，但是可以丢弃本次请求  依然是基于回调的方式，好处可以扁平化处理我们的逻辑，处理错误比较方便

  ```javascript
  function wrap(p1){
      let abort;
      let p2 = new Promise((resolve,reject)=>{
          abort = function(){
              reject('失败');
          }
      });
      let p =  Promise.race([p1,p2]);
      p.abort = abort;
      return p;
  }
  let p = wrap(new Promise((resolve,reject)=>{
      setTimeout(() => {
          resolve();  
      }, 3000);
  }))
  p.then(()=>{},()=>{console.log('失败')})
  p.abort();
  ```
  
  ```javascript a
  // 1
  let p = new Promise((resolve,reject)=>{
      reject();
      resolve();
  });
  p.then(()=>console.log('成功'),()=>console.log('失败'));
  // 2
  const promise = new Promise((resolve,reject)=>{
      console.log(1);
      resolve();
      console.log(2);
  })
  promise.then(()=>{
      console.log(3);
  })
  // 3
  Promise.resolve(1)
  .then(res=>2)
  .catch(err=>3)
  .then(res=>console.log(res));
  // 4
  Promise.resolve(1)
  .then(x=>x+1)
  .then(x=>{throw new Error('My Error')})
  .catch(()=>1)
  .then(x=>x+1)
  .then(x=>console.log(x))
  .catch(console.error)
  ```
  
- generator &  co 

- async + await