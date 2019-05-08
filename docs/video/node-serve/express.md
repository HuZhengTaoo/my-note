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

- express 中间件原理

```js
const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
    constructor() {
        // 存放中间件的列表
        this.routes = {
            all: [],   // app.use(...)
            get: [],   // app.get(...)
            post: []   // app.post(...)
        }
    }

    register(path) {
        const info = {}
        if (typeof path === 'string') {
            info.path = path
            // 从第二个参数开始，转换为数组，存入 stack
            info.stack = slice.call(arguments, 1)
        } else {
            info.path = '/'
            // 从第一个参数开始，转换为数组，存入 stack
            info.stack = slice.call(arguments, 0)
        }
        return info
    }

    use() {
        const info = this.register.apply(this, arguments)
        this.routes.all.push(info)
    }

    get() {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }

    post() {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }

    match(method, url) {
        let stack = []
        if (url === '/favicon.ico') {
            return stack
        }

        // 获取 routes
        let curRoutes = []
        curRoutes = curRoutes.concat(this.routes.all)
        curRoutes = curRoutes.concat(this.routes[method])

        curRoutes.forEach(routeInfo => {
            if (url.indexOf(routeInfo.path) === 0) {
                // url === '/api/get-cookie' 且 routeInfo.path === '/'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api/get-cookie'
                stack = stack.concat(routeInfo.stack)
            }
        })
        return stack
    }

    // 核心的 next 机制
    handle(req, res, stack) {
        const next = () => {
            // 拿到第一个匹配的中间件
            const middleware = stack.shift()
            if (middleware) {
                // 执行中间件函数
                middleware(req, res, next)
            }
        }
        next()
    }

    callback() {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
            }
            const url = req.url
            const method = req.method.toLowerCase()

            const resultList = this.match(method, url)
            this.handle(req, res, resultList)
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

// 工厂函数
module.exports = () => {
    return new LikeExpress()
}
```
- test.js

```js
const express = require('./like-express')

// 本次 http 请求的实例
const app = express()

app.use((req, res, next) => {
    console.log('请求开始...', req.method, req.url)
    next()
})

app.use((req, res, next) => {
    // 假设在处理 cookie
    console.log('处理 cookie ...')
    req.cookie = {
        userId: 'abc123'
    }
    next()
})

app.use('/api', (req, res, next) => {
    console.log('处理 /api 路由')
    next()
})

app.get('/api', (req, res, next) => {
    console.log('get /api 路由')
    next()
})

// 模拟登录验证
function loginCheck(req, res, next) {
    setTimeout(() => {
        console.log('模拟登陆成功')
        next()
    })
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    console.log('get /api/get-cookie')
    res.json({
        errno: 0,
        data: req.cookie
    })
})

app.listen(8000, () => {
    console.log('server is running on port 8000')
})

```
