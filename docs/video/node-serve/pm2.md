

- 线上环境
- 服务器稳定性
- 充分利用服务器硬件资源
- 线上日志记录

### PM2

- 进程守护，系统崩溃自动重启
- 启动多进程，充分利用cpu和内存
- 日志记录

```js

//package.json
"prd": "cross-env NODE_ENV=production pm2 start pm2.conf.json"

//pm2.conf.json
{
    "apps": {
        "name": "pm2-test-server",
        "script": "app.js",
        "watch": true,
        "ignore_watch": [
            "node_modules",
            "logs"
        ],
        "instances": 4,
        "error_file": "logs/err.log",
        "out_file": "logs/out.log",
        "log_date_format": "YYYY-MM-DD HH:mm:ss"
    }
}
```
- 常用命令
```js
- pm2 start ..., pm2 list
- pm2 restart <AppName>/<id>
- pm2 stop <AppName>/<id>,pm2 delete <AppName>/<id>
- pm2 info <AppName>/<id>
- pm2 log <AppName>/<id>
- pm2 moint <AppName>/<id> 

```
- 进程守护
- 配置
- 新建pm2配置文件(包括进程数量，日志文件目录等)
- 修改pm2启动命令，重启
- 访问server，检查日志文件的内容（日志记录是否生效）

- 多进程
- 为何使用多进程
- 多进程和redis
- 单个进程是受限制
- 内存，无法充分利用机器全部内存
- cpu 无法充分利用多核cpu的优势
- 多进程无法共享session，通过redis解决
