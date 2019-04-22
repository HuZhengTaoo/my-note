- 核心 登录校验 & 登录信息存储
- cookie 和 session
- session写入redis
- 开发登录功能，和前端联调(用到nginx反向代理)

- cookie
  - 什么是cookie
      - 存储在浏览器的一段字符串(<5kb)
      - 跨域不共享
      - 格式如k1=v1;k2=v2;k3=v3;因此可以存储数据化结构
      - 每次发送http请求,会请求域cookie一起发送给server
      - server可以修改cookie并返回给浏览器
      - 浏览器中也可以通过javascript修改cookie(有限制)
 - js操作cookie，浏览器看cookie
 - server端操作cookie，实现登录验证
      - 查看cookie
      - 修改cookie
      - 实现登录验证
- 在chrome调试node  pagejson --inspect
- 知道cookie的定义和特点
- 前后端如何查看和修改cookie
- 如何使用cookie实现登录验证
- cookie限制
```js
//获取cookie的过期时间
 //解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if(!item){
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key]=val
  })
const getCookieExpires = ()=>{
  const d = new Date()
  d.setTime(d.getTime() + (24*60*60*1000))
  return d.toGMTString()
}
 const blogResult = handleBlogRouter(req,res)
      if(blogResult){
        blogResult.then(blogData=>{
          if(needSetCookie){
            //操作cookie
          res.setHeader('Set-Cookie',`userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
          }
          res.end(
            JSON.stringify(blogData)
          )
        })
        return
      }

```
- session
 - 上一节的问题:会暴露username 很危险
 - 如何解决：cookie中存储userid,server端对应username
 - 解决方案:session 即server储存用户信息

```js
//app.js
// 解析session
  const SESSION_DATA = {}
  let needSetCookie = false
  let userId = req.cookie.userid 
  if(userId){
    if(!SESSION_DATA[userId]){
      SESSION_DATA[userId] = {}
    }
  }else {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    SESSION_DATA[userId] = {}
  }
  req.session = SESSION_DATA[userId]
//存session
// 登录
  if (method === 'POST' && req.path === '/api/user/login') {
    const {username , password}= req.body
      const result = loginCheck(username,password)
      return result.then(data=>{
        if(data.username){
          //设置session
            req.session.username = data.username
            req.session.realname = data.realname
            return new SuccessModel()
          }else{
            return new ErrorModel('登录失败')
          }
      })
  }
  //用session
  //登录验证的测试
  if(method === 'GET' && req.path ==='/api/user/login-test'){
    if(req.session.username){
      return Promise.resolve(
        new SuccessModel({
          session:req.session
        })
      )
    }
    return Promise.resolve(
      new ErrorModel('未登录')
    )
  }
```
- redis
- session 的问题
- 目前session直接是js变量,放在nodejs进程中
- 第一，进程内存有限,访问量过大,内存暴增怎么办
- 第二，正式线上运行是多进程，进程之间内存无法共享

- web server最常用的缓存数据库，数据存放在内存中
- 相比mysql，访问速度快(内存和硬盘不是一个数量级)
- 但是成本更高，可存储的数据量更小(内存的硬伤)
- mysql（硬盘数据库） redis（内存数据库）
- 将web server 和 redis拆分为两个独立的服务
- 双方都是独立的，都是可扩展（扩张成集群）
- 包括mysql，也是一个单独的服务，也可扩展

- 为何session适合用redis
- session访问频繁，对性能要求极高（每个端口都会处理session）
- session可不考虑断电丢失数据的问题（内存的硬伤，也有备份方案）
- session数据量不会太大（相比于mysql中存储的数据）

- 为何网站数据不适合用redis
- 操作评率不是很高（相比于session操作）
- 断电不会丢失，必须保存
- 数据量太大，内存成本太高

- redis-server
- redis-cli

```redis
set myname kiko
get myname
keys *
del myname
get mycity
set userid sesiion-val
get userid
```

```js
const redis = require('redis')

// 创建客户端
const redisClient = redis.createClient(6379, '127.0.0.1')
redisClient.on('error', err => {
    console.error(err)
})

// 测试
redisClient.set('myname', 'zhangsan2', redis.print)
redisClient.get('myname', (err, val) => {
    if (err) {
        console.error(err)
        return
    }
    console.log('val ', val)

    // 退出
    redisClient.quit()
})
```

```js
//redis
  REDIS_CONF = {
    post:6369,
    host:'127.0.0.1'
  }
const redis = require('redis')
const {REDIS_CONF} = require('../config/db')
const redisClient = redis.createClient(REDIS_CONF.port,REDIS_CONF.host)

redisClient.on('error',err => {
  console.error(err)
})

function set(key,val){
  if(typeof val === 'object'){
    val = JSON.stringify(val)
  }
  redisClient.set(key,val,redis.print)
}

function get(key){
  return new Promise((resolve,reject)=>{
    redisClient.get(key,(err,val)=>{
      if(err){
        reject(err)
        return
      }
      if(val == null){
        resolve(null)
        return
      }
      try {
        resolve(
          JSON.parse(val)
        )
      }catch(ex){
          resolve(val)
      }
    })
  })
}
module.exports ={
  set, 
  get
}
```

```js
//解析session (使用redis)
    let needSetCookie = false
    let userId = req.cookie.userid 
    if(!userId){
      needSetCookie = true
      userId = `${Date.now()}_${Math.random()}`
      //初始化redis 中的session
      set(userId,{})
    }
    //获取session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
      if(sessionData == null){
        //初始化redis 中的session
        set(req.sessionId,{})
        //设置session
        req.session = {}
      }else{
        req.session = sessionData
      }
    })
```

- 和前端联调
- 登录功能依赖cookie，必须用浏览器来联调
- cookie跨域不共享，前端和server端必须同域
- 需要用到nignx做代理，让前后端同域
```j
http-server
http-server -p 5000
```

- nignx
- 高性能的web服务器，开源免费
- 一般用于静态服务，负载均衡
- 反向代理
- 命令
- 测试配置文件格式是否正确nignx -t
- 启动nginx 重启nginx -s reload
- 停止nginx -s stop
```txt
需要启动redis-server
      nginx
      mysql
      前端服务
      后端服务
http-server -p 5500启动前端页面
/usr/local/etc/nginx/nginx.conf
location / {
          proxy_pass  http://localhost:5500;
        }
location /api/ {
  proxy_pass  http://localhost:8000;
  proxy_set_header Host $host;
}
```
```js
//http://www.nginx.cn/784.html
	#默认PC端访问内容
    root /usr/local/website/web;
 
	#如果是手机移动端访问内容
    if ( $http_user_agent ~ "(MIDP)|(WAP)|(UP.Browser)|(Smartphone)|(Obigo)|(Mobile)|(AU.Browser)|(wxd.Mms)|(WxdB.Browser)|(CLDC)|(UP.Link)|(KM.Browser)|(UCWEB)|(SEMC-Browser)|(Mini)|(Symbian)|(Palm)|(Nokia)|(Panasonic)|(MOT-)|(SonyEricsson)|(NEC-)|(Alcatel)|(Ericsson)|(BENQ)|(BenQ)|(Amoisonic)|(Amoi-)|(Capitel)|(PHILIPS)|(SAMSUNG)|(Lenovo)|(Mitsu)|(Motorola)|(SHARP)|(WAPPER)|(LG-)|(LG/)|(EG900)|(CECT)|(Compal)|(kejian)|(Bird)|(BIRD)|(G900/V1.0)|(Arima)|(CTL)|(TDG)|(Daxian)|(DAXIAN)|(DBTEL)|(Eastcom)|(EASTCOM)|(PANTECH)|(Dopod)|(Haier)|(HAIER)|(KONKA)|(KEJIAN)|(LENOVO)|(Soutec)|(SOUTEC)|(SAGEM)|(SEC-)|(SED-)|(EMOL-)|(INNO55)|(ZTE)|(iPhone)|(Android)|(Windows CE)|(Wget)|(Java)|(curl)|(Opera)" )
	{
		root /usr/local/website/mobile;
	}
 
	index index.html index.htm;
}
```
