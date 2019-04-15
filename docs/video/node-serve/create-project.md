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