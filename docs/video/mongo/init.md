- app
 - database 
   - scheme
    - token.js
   - init.js

```js
// schema
// model
// entity
//创建一个token模型
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TokenSchema = new Schema({
  name: String, // accessToken
  token: String,
  expires_in: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})
//插入如数据之前的校验
TokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})
//模型上面写入方法
TokenSchema.statics = {
  async getAccessToken () {
    const token = await this.findOne({
      name: 'access_token'
    })

    if (token && token.token) {
      token.access_token = token.token
    }
    
    return token
  },

  async saveAccessToken(data) {
    let token = await this.findOne({
      name: 'access_token'
    })

    if (token) {
      token.token = data.access_token
      token.expires_in = data.expires_in
    } else {
      token = new Token({
        name: 'access_token',
        token: data.access_token,
        expires_in: data.expires_in
      })
    }

    await token.save()

    return data
  }
}
// 模型的实例化
const Token = mongoose.model('Token', TokenSchema)

  ```
- mongo连接
```js
const mongoose = require('mongoose')
const { resolve } = require('path')
const glob = require('glob')
mongoose.Promise = global.Promise
exports.initSchemas = () => {
  glob.sync(resolve(__dirname,'./scheme','**/*.js')).forEach(require)
}

exports.connect = (db) => {
  return new Promise((resolve,reject)=>{
    mongoose.connect(db,{useNewUrlParser:true})
    mongoose.connection.on('disconnect',()=>{
      console.log('数据库挂了')
    })
    mongoose.connection.on('error',err=>{
      console.log(err)
    })
    mongoose.connection.on('open',()=>{
      console.log('mongodb connectd')
      resolve()

    })
  })
}
```

- 项目中去调用mongo的数据
```js
//wechat/index.js
const mongoose = require('mongoose')
const Token = mongoose.model('Token')
const wechatCfg = {
  wechat:{
    appID:config.wechat.appId,
    appSecret:config.wechat.appSecret,
    token:config.wechat.token,
    getAccessToken:async () => {
      const res = await Token.getAccessToken()
      return res
    },
    saveAccessToken:async (data) =>{
      const res = await Token.saveAccessToken(data)
      return res
    }
  }
}
exports.test = async function(){
  const client = new Wechat(wechatCfg.wechat)
  const data = await client.fetchAccessToken()
 
}
```