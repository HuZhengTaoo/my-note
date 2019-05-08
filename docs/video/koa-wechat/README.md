wechat-koa 目录结构分析
- config
  - config.js
   负责appid，token，appsecre基础信息
  - routes.js
   所有的路由全部在这里写
-  wechat
  - index.js
    - 负责调用mongoose数据库 + 调用wechat-lib+ oauth
    - 暴露getWechat getOAuth
  - menu.js
  - reply.js
- wechat-lib
  - index.js
  所有暴露接口的所在地
  - middleware.ks
  负责把数据暴露出去
  - oauth.js
  授权函数，获取用户信息函数
- app
 - api
  - index.js
   把所有的接口统一在index里面暴露
  - wechat.js
   getSignature  getAuthorizeURL getUserinfoByCode saveWechatUser
- controllers
 - wechat.js
 负责把暴露对网页端的所有接口，这里的接口暴露给app.js形成中间件
  - getSDKSignature
  - sdk
  - hear
  - oauth
  - userinfo
  - checkWechat
  - wechatRedirect
