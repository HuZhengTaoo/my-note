- sql 注入 窃取数据库内容
 - 最原始，最简单的攻击，从有web2.0就有了sql注入攻击
 - 攻击方式 输入一个sql片段，最终拼接一段攻击代码
 - 预防措施 使用mysql的escape函数处理输入内容即可
- xss攻击 窃取前端的cookie内容
- 密码加密 保障用户信息安全
- server端攻击方式非常多，预防手段也非常多
- 有些攻击需要硬件和服务来支持(需要OP支持)，如DDOS

```sql
select username , realname from users
where username='zhangsan';delete from users;-- 'and password='123';
```
```js
module.exports ={
  exec,
  escape:mysql.escape
}
const { exec, escape } = require('../db/mysql')
password = escape(password)
//${xxx}不用打引号
const sql = `
    select username, realname from users where username=${username} and password=${password}
`
```
- xss攻击
- 攻击方式:在页面展示内容中有js代码，以获取网页信息
- 预防措施:转换生成js特殊符号
```js
const xss = require('xss')
const content = xss(blogData.content)
```
- 密码加密
```js
const crypto = require('crypto')

// 密匙
const SECRET_KEY = 'WJiol_8776#'

// md5 加密
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

// 加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

module.exports = {
    genPassword
}
password = genPassword(password)
```