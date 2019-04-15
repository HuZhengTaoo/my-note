### demo

- a.json -> b.json -> c.json

```js
const fs = require('fs')
const path = require('path')

const fullFileName = path.resolve(__dirname,'files','a.json')
fs.readFile(fullFileName,(err,data)=>{
  if(err){
    console.error(err)
    return
  }
  console.log(data.toString())
})
```

```js
const fs = require('fs')
const path = require('path')

//callback 方式获取一个文件
function getFileContent(filename,cb){
  const fullFileName = path.resolve(__dirname,'files',filename)
  fs.readFile(fullFileName,(err,data)=>{
    if(err){
      console.error(err)
      return
    }
    cb(
      JSON.parse(data.toString())
    )
  })
}

getFileContent('a.json',aData => {
  console.log(aData)
  getFileContent(aData.next,aData => {
     console.log(aData)
  getFileContent(aData.next,aData => {
        console.log(aData)
    })
  })
})
```

- promise

```js
function getFileContent(filename){
    return new Promise((resolve,reject) =>{
      const fullFileName = path.resolve(__dirname,'files',filename)
      fs.readFile(fullFileName,(err,data)=>{
        if(err){
          reject(err)
          return
        }
        resolve(JSON.parse(data.toString()))
      })
    })
}

getFileContent('a.json').then(aData => {
  console.log(aData)
  return getFileContent(aData.next)
}).then(bData => {
  console.log(bData)
  return getFileContent(bData.next)
}).then(cData => {
  console.log(cData)
})

```

- await async

```js
async function readFileData() {
    // 同步写法
    try {
        const aData = await getFileContent('a.json')
        console.log('a data', aData)
        const bData = await getFileContent(aData.next)
        console.log('b data', bData)
        const cData = await getFileContent(bData.next)
        console.log('c data', cData)
    } catch (err) {
        console.error(err)
    }
}

readFileData()

// async function readAData() {
//     const aData = await getFileContent('a.json')
//     return aData
// }
// async function test() {
//     const aData = await readAData()
//     console.log(aData)
// }
// test()

// async await 要点：
// 1. await 后面可以追加 promise 对象，获取 resolve 的值
// 2. await 必须包裹在 async 函数里面
// 3. async 函数执行返回的也是一个 promise 对象
// 4. try-catch 截获 promise 中 reject 的值
```