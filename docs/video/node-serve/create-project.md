### 项目目录
- bin
  - www.js
- logs
- src
  - conf
    - db.js
  - controller
    - blog.js
    - user.js
  - db
    - mysql.js
    - redis.js
  - model
    - resModel.js
  - router
    - blog.js
    - user.js
  - utils
    - cryp.js
    - log.js
    - readline.js
- app.js
- package.json

### 需要安装的插件
- nodemon
- cross-env

```js
"dev":"cross-env NODE_ENV=dev nodemon ./bin/www.js"
```

### 开发博客项目之接口
- src
  - controller (负责连接数据库)
  - model (处理数据的输出的统一模式)
  - router (系统的路由层)

- controller
```js
//blog.js
const getList = (author,keyword) =>{
  return [
    {
      id:1,
      title:'标题1',
      content:'内容1',
      author:'haha1'
    }
  ]
}
const updateBlog = (id,blogData = {}) => {
  return true
}

module.exports = {
  getList,
  updateBlog,
}
```
- model
```js
class BaseModel {
  constructor(data,message){
    if(typeof data === 'string'){
      this.message = data
      data = null
      message = null
    }
    if(data){
      this.data = data
    }
    if(message){
      this.message = message
    }
  }
}

class SuccessModel extends BaseModel{
  constructor(data,message){
    super(data,message)
    this.errno = 0
  }
}

class ErrorModel extends BaseModel {
  constructor(data,message){
    super(data,message)
    this.errno = -1
  }
}
module.exports= {
  SuccessModel,
  ErrorModel
}
```
```js
const {getList,getDetail,newBlog,updateBlog,delBlog} = require('../controller/blog')
const {SuccessModel,ErrorModel } = require('../model/resModel')
const handleBlogRouter = (req,res) => {
  const method = req.method
  const url = req.url
  const path = url.split('?')[0]
  const id = req.query.id
  //获取博客列表
  if(method === 'GET' && path === '/api/blog/list'){
    const author = req.query.author
    const keyword = req.query.keyword || ''
    const listData = getList(author,keyword)
    return new SuccessModel(listData)
  }

  // 更新一篇博客
  if (method === 'POST' && req.path === '/api/blog/update') {
    const result = updateBlog(id,req.body)
    if(result){
      return new SuccessModel()
    } else {
      return new ErrorModel('更新失败')
    }
  }
module.exports= handleBlogRouter
```

```js
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring')
const getPostData = (req) => {
  return new Promise((resolve,reject) => {
    if(req.method !== 'POST'){
      resolve({})
      return
    }
    if(req.headers['content-type']!=='application/json'){
      resolve({})
      return
    }
    let postData = ''
    req.on('data',chunk => {
      postData +=chunk.toString()
    })
    req.on('end',()=>{
      if(!postData){
        resolve({})
        return
      }
      resolve(
        JSON.parse(postData)
      )
    })
  })
}
const serverHandle = (req,res)=>{
  // 设置返回格式 JSON
  res.setHeader('Content-type','application/json')
  
  //获取path
  const url = req.url
  req.path = url.split('?')[0]

  //解析query
  req.query = querystring.parse(url.split('?')[1])

  // 处理post data 
  getPostData(req).then(postData => {
    req.body = postData
      // 处理blog的路由

      const blogData = handleBlogRouter(req,res)
      if(blogData){
        res.end(
          JSON.stringify(blogData)
        )
        return
      }
      // 处理user的路由
      const userData = handleUserRouter(req,res)
      if(userData){
        res.end(
          JSON.stringify(userData)
        )
        return
      }
      //未命中,返回404
      res.writeHead(404,{"Content-type":"text/plain"})
      res.write("404 not found")
      res.end()
      })
}

module.exports = serverHandle
```
- mysql
https://blog.csdn.net/hjf161105/article/details/78850658
https://www.navicat.com.cn/manual/online_manual/cn/navicat/win_manual/index.html#/main_window

- 2/8原则
- 增删改查

```sql
use myblog
-- show tables
-- 增加
-- insert into users (username,`password`,realname) values ('zhangsan','123','张三')

-- select * from users
-- select id,username from users
-- select * from users where username='zhangsan' and `password`='123'
-- select * from users where username like '%zhang%'
-- select * from users where password like '%1%'
-- select * from users where password like '%1%' order by id;
-- select * from users where password like '%1%' order by id desc; //倒序
-- 更新
-- update users set realname='李四' where username='zhangsan'
-- 删除
-- delete from users where username='李四'
-- update users set state='0' where username='list' --软删除
-- select VERSION() //查询版本
```
进入mysql
mysql -u root -p

- demo
```js
const mysql =  require('mysql')

//创建链接对象

const con = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'40676070',
  port:'3306',
  database:'myblog'
})

//开始链接
con.connect()

//执行sql语句

const sql = 'select * from users'
con.query(sql,(err,result) => {
  if(err){
    console.error(err)
    return
  }
  console.log(result)
})

//关闭链接
con.end()
```

- 项目中的使用mysql

```js
// config/db.js
const env = process.env.NODE_ENV
//配置
let MYSQL_CONF

if(env === 'dev'){
  MYSQL_CONF = {
    host:'localhost',
    user:'root',
    password:'40676070',
    port:'3306',
    database:'myblog'
  }
}
if(env === 'production'){
  MYSQL_CONF = {
    host:'localhost',
    user:'root',
    password:'40676070',
    port:'3306',
    database:'myblog'
  }
}

module.exports = MYSQL_CONF
```

```js
//db/mysql.js
const mysql = require('mysql')
const {MYSQL_CONF} = require('../config/db')

//创建对象
const con = mysql.createConnection(MYSQL_CONF)

//开始链接
con.connect()

//统一执行sql的函数
function exec(sql){
  return new Promise((resolve,reject)=>{
    con.query(sql,(err,result)=>{
      if(err){
        reject(err)
        return
      }
      resolve(result)
    })
  })
}
//这里不去断开，就是单例模式，不会多次创建
module.exports ={
  exec
}
```

```js
//controller/blog.js
const {exec}  =  require('../db/mysql')
const getList = (author,keyword) => {
  // 1=1相当于占位 ，避免where后面没有值从而报错的情况
  let sql = `select * from blogs where 1=1 `
  if(author){
    sql += `and author='${author}' `
  }
  if(keyword){
    sql +=`and title like '%${keyword}%' ` 
  }
  sql +=`order by createtime desc;`
  return exec(sql)
}
//router/blog.js
if(method === 'GET' && path === '/api/blog/list'){
    const author = req.query.author
    const keyword = req.query.keyword || ''
    // const listData = getList(author,keyword)
    // return new SuccessModel(listData)
    const result = getList(author,keyword)
    return result.then( listData =>{
      return new SuccessModel(listData)
    })
  }
//app.js
// 处理blog的路由

      // const blogData = handleBlogRouter(req,res)
      // if(blogData){
      //   res.end(
      //     JSON.stringify(blogData)
      //   )
      //   return
      // }
      const blogResult = handleBlogRouter(req,res)
      if(blogResult){
        blogResult.then(blogData=>{
          res.end(
            JSON.stringify(blogData)
          )
        })
        return
      }
```
- 查询一个数据和查询一列
```js
const getDetail = (id) => {
  const sql = `select * from blogs where id='${id}'`
  return exec(sql).then(rows => {
    console.log(rows)
    return rows[0]
  })
}
const getList = (author,keyword) => {
  // 1=1相当于占位 ，避免where后面没有值从而报错的情况
  let sql = `select * from blogs where 1=1 `
  if(author){
    sql += `and author='${author}' `
  }
  if(keyword){
    sql +=`and title like '%${keyword}%' ` 
  }
  sql +=`order by createtime desc;`
  return exec(sql)
}
const newBlog = (blogData = {}) => {
  //blogData 是一个博客对象,包含title,content,author,time
  const title = blogData.title
  const content = blogData.content
  const author = blogData.author
  const createtime = Date.now()
  const sql = `
    insert into blogs (title,content,createtime,author)
    values ('${title}','${content}','${createtime}','${author}')
  `
  return exec(sql).then(insertData => {
    console.log('insertData',insertData)
    return {
      id:insertData.insertId
    }
  })
}
const updateBlog = (id,blogData = {}) => {
  // id 就是要更新的id
  // blogData 是一个博客对象
  const title = blogData.title
  const content = blogData.content
  const sql = `
    update blogs set title='${title}',content='${content}' where id = '${id}'
  `
  return exec(sql).then(updateBlog => {
    console.log(updateBlog)
    if(updateBlog.affectedRows > 0){
      return true
    }
    return false
  })
}
const delBlog = (id,author) => {
  const sql = `delete from blogs where id='${id}' and author='${author}'`
  return exec(sql).then(delData => {
    if(delData.affectedRows > 0){
      return true
    }
    return false
  })
}
```