1.消息回复接口1
https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1433751277
2.access_token处理接口
https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
1.access_token
2.tourser：openid的获取
3.获取用户信息
getUserinfoByCode
3.获取用户信息接口
https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140839
4.获取code接口
5.用户关注公众号的时候就需要绑定数据
6.自动回复绑定账号，输入手机号码
或者手机号码直接授权绑定openid

openid的获取需要通过授权才能拿到
https://blog.csdn.net/hankin_/article/details/79232337
http://h52ew81ylu.51http.tech/?code=001P7fMX1z7G5112lQMX1JbcMX1P7fMT&state=STATE

流程
1.关注微信公众还，
2.回复消息，绑定账号
3.静默授权+绑定手机号码
4.以后只需要通过手机号码就可以调用手机信息

golang-serve
1.access_token
2.openid与手机号码的绑定
3.前端的手机绑定，加上解除绑定

- 异常处理
1.拒绝授权的嘛
2.各种异常的考虑情况

- access_token/appid/appsceret
- 用户手机号码 + openid的融合 + 用户关注公众号的标记位（用户绑定+用户解除绑定）
- 根据uid 拿到 openid的接口
（接口设计需要可能有微信登陆的接口）


++++存储微信公众号的access_token ++++
存储access_token2小时的过期时间---需要一个存储的access_token的接口，并且是有更新机制
以后所有得接口访问都需要用access_token并且是不区分用户

+++++.完成用户绑定情况 +++++
情况一
（是否是新用户，新用户是否注册即绑定？）
1.用户关注公众号之后，发送个链接的卡片
2.输入手机号码完成绑定操作，进入这个绑定页面的时候需要授权 + openid + 手机号码的完成绑定
用的是token机制（绑定的时候需要加字段）
3.解除绑定

+++++ pc端调用 ++++++
1.当宝箱完成的时候，pc端发调用koa端接口
koa接口需用拿到
1.需要判断用户是否完成微信公众的绑定
2.未绑定--提示绑定，绑定 --> 首先去数据库里面看access_token过期时间，如果过期，需要重新获取access_token
那么前端可以给我uid，
我需要根据uid--->openid

