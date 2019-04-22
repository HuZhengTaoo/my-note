- koa2中间件抽象
- 公众号消息能力
- 开发问答机器人
- 回复模板抽象
- 全局票据的管理
- unionid 是微信id
- openid是 每个公众号的id

- post发送给用户
- 拿到xml 解析xml-json 数据片段 交道koa的ctx


- 微信接口认证过程
```js

```

- 基本消息回复
- 目录结构
- config
  - config.js
- wechat
  - reply.js
- wechat-lib
  - middleware.js
  - tpl.js
  - util.js
- check.js
```js
//check.js
const Koa = require('koa')
const sha1 = require('sha1')
const wechat = require('./wechat-lib/middleware')
const config = require('./config/config')
const {reply} = require('./wechat/reply')

const app = new Koa()
//加载认证的中间键
app.use(wechat(config.wechat,reply))

app.listen('3000',()=>{
  console.log('开启')
})
//wechat-lib/middleware.js
const sha1 = require('sha1')
const getRowBody = require('raw-body')
const util = require('./util')

module.exports = (config,reply)=>{
  return async (ctx,next) =>{
      const {
        signature,
        timestamp,
        nonce,
        echostr
      } = ctx.query
      const token = config.token
      console.log(ctx.query)
      let str = [token,timestamp,nonce].sort().join('')
      const sha = sha1(str)
      if(ctx.method === 'GET'){
        if(sha === signature){
          ctx.body = echostr
        }else{
          ctx.body = 'wrong'
        }
      } else if (ctx.method === 'POST'){
        if(sha !== signature){
          return (ctx.body = 'failed')
        }
        const data = await getRowBody(ctx.req,{
          length: ctx.length,
          limit: '1mb',
          encoding: ctx.charset
        })
        const content = await util.parseXML(data)
        const message = util.formatMessage(content.xml)
        ctx.wexin = message
        
        await reply.apply(ctx, [ctx, next])
        const replyBody = ctx.body
        const msg = ctx.wexin
        const xml = util.tpl(replyBody,msg)
        
        ctx.status = 200
        ctx.type = 'application/xml'
        ctx.body = xml
      }
      
  }
}
// tpl.js
const ejs = require('ejs')

const tpl = `
<xml>
  <ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>
  <FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>
  <CreateTime><%= createTime %></CreateTime>
  <MsgType><![CDATA[<%= msgType %>]]></MsgType>
  <% if (msgType === 'text') { %>
    <Content><![CDATA[<%- content %>]]></Content> 
  <% } else if (msgType === 'image') { %>
    <Image>
    <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
    </Image>
  <% } else if (msgType === 'voice') { %>
    <Voice>
      <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
    </Voice>
  <% } else if (msgType === 'video') { %>
    <Video>
      <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
      <Title><![CDATA[<%= content.title %>]]></Title>
      <Description><![CDATA[<%= content.description %>]]></Description>
    </Video>
  <% } else if (msgType === 'music') { %>
    <Music>
      <Title><![CDATA[<%= content.title %>]]></Title>
      <Description><![CDATA[<%= content.description %>]]></Description>
      <MusicUrl><![CDATA[<%= content.musicUrl %>]]></MusicUrl>
      <HQMusicUrl><![CDATA[<%= content.hqMusicUrl %>]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[<%= content.thumbMediaId %>]]></ThumbMediaId>
    </Music>
  <% } else if (msgType === 'news') { %>
    <ArticleCount><![CDATA[<%= content.length %>]]></ArticleCount>
    <Articles>
      <% content.forEach(function(item) { %>
        <item>
          <Title><![CDATA[<%= item.title %>]]></Title>
          <Description><![CDATA[<%= item.description %>]]></Description>
          <PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
          <Url><![CDATA[<%= item.url %>]]></Url>
        </item>
      <% }) %>
    </Articles>
  <% } %>
</xml>
`

const compiled = ejs.compile(tpl)

module.exports = compiled
//utils.js
const xml2js = require('xml2js')
const template = require('./tpl')
exports.parseXML = xml => {
  return new Promise((resolve,reject)=>{
    xml2js.parseString(xml,{trim:true},(err,content) => {
      if(err) reject(err)
      else resolve(content)
    })
  })
}
const formatMessage = result => {
  let message = {}

  if (typeof result === 'object') {
    const keys = Object.keys(result)

    for (let i = 0; i < keys.length; i++) {
      let item = result[keys[i]]
      let key = keys[i]

      if (!(item instanceof Array) || item.length === 0) {
        continue
      }

      if (item.length === 1) {
        let val = item[0]

        if (typeof val === 'object') {
          message[key] = formatMessage(val)
        } else {
          message[key] = (val || '').trim()
        }
      } else {
        message[key] = []

        for (let j = 0; j < item.length; j++) {
          message[key].push(formatMessage(item[j]))
        }
      }
    }
  }

  return message
}

const tpl = (content,message) => {
  let type = 'text'
  if (Array.isArray(content)){
    type = 'news'
  }
  if(!content) content = 'empty news'
  if(content && content.type){
    type = content.type
  }
  let info = Object.assign({},{
    content : content,
    msgType:type,
    createTime: new Date().getTime(),
    toUserName:message.FromUserName,
    fromUserName:message.ToUserName
  })
  return template(info)
}
exports.formatMessage = formatMessage
exports.tpl = tpl
//reply
exports.reply = async (ctx,next) => {
  const message = ctx.wexin
  console.log(message)
  if(message.MsgType === 'text'){
    let content = message.Content
    let reply = content
    if(content === '1'){
      reply = '我是第一名'
    } else if(content === '2'){
      reply = '再见啦'
    } else if(content === '3'){
      reply = '3333'
    } else if(content === 'imooc'){
      reply = 'imooc'
    }
    ctx.body = reply
  }
  await next()
}
//config.js
module.exports = {
  port:3000,
  wechat: {
    appId:'wxcc12164b901ea2f4',
    appSecret:'4edec36120c05273e2020d2618fd7623',
    token:'iqidao'
  }
}
```

- access_token