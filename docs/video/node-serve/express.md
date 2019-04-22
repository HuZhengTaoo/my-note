- express 中间件机制
- 开发接口，连接数据库，实现登录，日志记录
- 分析express中间件原理
 - 脚手架express-generator
 - 初始化代码介绍，处理路由
 - npm install express-generator -g

```js
//处理cookie
 cookieParser = require('cookie-parser');
//处理logger
 logger = require('morgan');
//类似postdata
app.use(express.json());
```
- app.use
- next参数是什么

```js
const express = require('express')

// 本次 http 请求的实例
const app = express()

app.use((req, res, next) => {
    console.log('请求开始...', req.method, req.url)
    next()
})

app.use((req, res, next) => {
    // 假设在处理 cookie
    req.cookie = {
        userId: 'abc123'
    }
    next()
})

app.use((req, res, next) => {
    // 假设处理 post data
    // 异步
    setTimeout(() => {
        req.body = {
            a: 100,
            b: 200
        }
        next()
    })
})

app.use('/api', (req, res, next) => {
    console.log('处理 /api 路由')
    next()
})

app.get('/api', (req, res, next) => {
    console.log('get /api 路由')
    next()
})
app.post('/api', (req, res, next) => {
    console.log('post /api 路由')
    next()
})

// 模拟登录验证
function loginCheck(req, res, next) {
    setTimeout(() => {
        console.log('模拟登陆失败')
        res.json({
            errno: -1,
            msg: '登录失败'
        })

        // console.log('模拟登陆成功')
        // next()
    })
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    console.log('get /api/get-cookie')
    res.json({
        errno: 0,
        data: req.cookie
    })
})

app.post('/api/get-post-data', loginCheck, (req, res, next) => {
    console.log('post /api/get-post-data')
    res.json({
        errno: 0,
        data: req.body
    })
})

app.use((req, res, next) => {
    console.log('处理 404')
    res.json({
        errno: -1,
        msg: '404 not fount'
    })
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})

```

```js
function loginCheck(req,res,next){
  console.log('模拟登陆')
  setTimeout(()=>{
    next()
  })
}
//失败
function loginCheck(req,res,next){
  console.log('失败')
  setTimeout(()=>{
    res.json({
      errno:-1,
      msg:'登陆失败'
    })
  })
}
app.get('/api/get-cookie',loginCheck,(req,res,next)=>{
  console.log('get /api/get-cookie')
  res.json({
    errno:0,
    data:req.cookie
  })
})
```

- 登陆
- 使用express-session和connect-redis,简单方便
- req.session保存登陆信息，登陆校验做成express中间件
- yarn add express-session -S
```js
const session =require('express-session')
app.use(session({
  secret:'kiko_#123#',
  cookie:{
    path:'/', //默认配置
    httpOnly:true, //默认配置
    maxAge:24*60*60*1000
  }
}))
//测试
router.get('/session-test',(req,res,next)=>{
  const session = req.session
  if(session.viewNum == null){
    session.viewNum = 0
  }
  session.viewNum++
  res.json({
    viewNum:session.viewNum
  })
})

```

```js
const session =require('express-session')
const RedisStore = require('connect-redis')(session)
const redisClient = require('./db/redis')
const sessionStore = new RedisStore({redisClient})
app.use(session({
  secret:'kiko_#123#',
  cookie:{
    path:'/', //默认配置
    httpOnly:true, //默认配置
    maxAge:24*60*60*1000
  },
  store:sessionStore
}))

```

- middleware 使用

```js
const {ErrorModel}  = require('../model/resModel.js')
module.exports = (req,res,next) => {
  if(req.session.username){
    next()
    return
  }
  res.json(
    new ErrorModel('未登录')
  )
}

const loginCheck = require('../middleware/loginCheck')
router.post('/new', loginCheck, (req, res, next) => {
    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
})
```

- 日志
- access log记录 直接使用脚手架推荐morgan
- 自定义日志使用console.log和console.error即可  -- pm2

```js
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境 / 测试环境
  app.use(logger('dev'));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'log', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  })
```