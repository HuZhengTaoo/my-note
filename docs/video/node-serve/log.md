### 后端日志
- 访问日志 access log (server端最重要的日志)
- 自定义日志(包括自定义事件，错误记录)
- nodejs文件操作,nodejs stream
- 日志功能开发和使用
- 日志文件拆分,日志内容拆分
- 日志要存储到文件中
- 为何不存储到mysql
- 为何不存储到redis

-demo
```js
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname,'data.txt')
// 读取文件内容
fs.readFile(fileName, (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    // data 是二进制类型，需要转换为字符串
    console.log(data.toString())
})
// 写入文件
const content = '这是新写入的内容\n'
const opt = {
    flag: 'a'  // 追加写入。覆盖用 'w'
}
fs.writeFile(fileName, content, opt, (err) => {
    if (err) {
        console.error(err)
    }
})
// 判断文件是否存在
fs.exists(fileName, (exist) => {
    console.log('exist', exist)
})
```

- IO操作的性能瓶颈
- IO包括‘网络IO’和'文件IO'
- 相比于cpu计算和内存读写，IO的突出特点就是慢
https://www.cnblogs.com/dolphinX/p/6285240.html
https://www.jianshu.com/p/81b032672223

- stream
```js
//标准输入输出，pipe就是管道（符合水流管道的模型图）
//process.stdin 获取数据，直接通过管道传递给process.stdout
process.stdin.pipe(process.stdout)

const http = require('http')
const server = http.createServer((req,res)=>{
  if(req.method ==='POST'){
    req.pipe(res)
  }
})
server.listen(8000)
```

```js
const http = require('http')
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        req.pipe(res)  // 最主要
    }
})
server.listen(7000)

// 复制文件
const fs = require('fs')
const path = require('path')

const fileName1 = path.resolve(__dirname, 'data.txt')
const fileName2 = path.resolve(__dirname, 'data-bak.txt')
//读取文件stream对象
const readStream = fs.createReadStream(fileName1)
//写入文件的stream对象
const writeStream = fs.createWriteStream(fileName2)
//执行拷贝,通过pipe
readStream.pipe(writeStream)
//数据读取完成,即拷贝完成
readStream.on('data', chunk => {
    console.log(chunk.toString())
})
readStream.on('end', () => {
    console.log('copy done')
})


const http = require('http')
const fs = require('fs')
const path = require('path')
const fileName1 = path.resolve(__dirname, 'data.txt')
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const readStream = fs.createReadStream(fileName1)
        readStream.pipe(res) //将res作为stream的dest
    }
})
server.listen(8000)
```
```js
//utils/logs
const fs = require('fs')
const path = require('path')
//写日志
function writeLog(writeStream,log){
  writeStream.write(log + '\n')
}
//生成write stream
function createWriteStream(filename){
  const fullFileName = path.join(__dirname,'../','../','logs',filename)
  const writeStream = fs.createWriteStream(fullFileName,{
    flags:'a'
  })
  return writeStream
}

//访问日志
const accessWriteStream = createWriteStream('access.log')
function access(log){
  writeLog(accessWriteStream,log)
}
module.exports = {
  access
}
```
```js
const serverHandle = (req,res)=>{
  // 设置返回格式 JSON
  res.setHeader('Content-type','application/json')
  // 记录 access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
```
- 日志拆分
- 日志内容会慢慢积累，放在一个文件不好处理
- 按时间划分日志文件，如2019-02-10.access.log
- 实现方式:linux的crontab命令.即定时器任务
### crontab
- 设置定时任务,格式：*****command
- 将access.log拷贝并重命名为2019-02-10.access.log
- 清空access.log文件，继续积累日志
```js
psw显示当前目录
//utils/copy.sh
#!/bin/sh
cd /Users/xl/Desktop/nodejs-myblog/code-demo/creat-blog/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log
```

```js
const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 文件名
const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log')
// 创建 read stream
const readStream = fs.createReadStream(fileName)

// 创建 readline 对象
const rl = readline.createInterface({
    input: readStream
})

let chromeNum = 0
let sum = 0

// 逐行读取
rl.on('line', (lineData) => {
    if (!lineData) {
        return
    }

    // 记录总行数
    sum++

    const arr = lineData.split(' -- ')
    if (arr[2] && arr[2].indexOf('Chrome') > 0) {
        // 累加 chrome 的数量
        chromeNum++
    }
})
// 监听读取完成
rl.on('close', () => {
    console.log('chrome 占比：' + chromeNum / sum)
})


```
- 日志拆分
- 针对access.log日志，分析chrome的占比
- 日志是按行存储的，一行就是一条日志
- 使用nodejs的readline(基于stream效率高)
- crotab查分日志 readline分析日志内容