- 中间件机制
- app.use
- next参数是什么

```js
const Koa = require('koa');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
  console.log('第一层洋葱 - 开始')
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  console.log('第一层洋葱 - 结束')
});

// x-response-time
app.use(async (ctx, next) => {
  console.log('第二层洋葱 - 开始')
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log('第二层洋葱 - 结束')
});

// response
app.use(async ctx => {
  console.log('第三层洋葱 - 开始')
  ctx.body = 'Hello World';
  console.log('第三层洋葱 - 结束')
});

app.listen(8000);
```
```js
const http = require('http')

// 组合中间件
// 传入中间件列表
function compose(middlewareList) {
    return function (ctx) {
        // 定义一个派发器，这里实现next机制
        function dispatch(i) {
           //获取当前中间件
            const fn = middlewareList[i]
            try {
                //保证的是promise形式
                return Promise.resolve(
                    // 通过i+1获取下一个中间件，传递给next
                    fn(ctx, dispatch.bind(null, i + 1))  // promise
                )
            } catch (err) {
                return Promise.reject(err)
            }
        }
        //开始派发第一个中间件
        return dispatch(0)
    }
}

class LikeKoa2 {
    constructor() {
        this.middlewareList = []
    }

    use(fn) {
        this.middlewareList.push(fn)
        return this
    }

    createContext(req, res) {
        const ctx = {
            req,
            res
        }
        ctx.query = req.query
        return ctx
    }
    //处理中间件http请求
    handleRequest(ctx, fn) {
      //这个middleware就是compose函数返回的fn
      //执行middleware(ctx)其实就是执行中间件函数，然后再用Promise.resolve封装并返回
        return fn(ctx)
    }

    callback() {
        const fn = compose(this.middlewareList)

        return (req, res) => {
            const ctx = this.createContext(req, res)
            return this.handleRequest(ctx, fn)
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = LikeKoa2

```

- test.js
```js
const Koa = require('./like-koa2');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx['X-Response-Time'];
  console.log(`${ctx.req.method} ${ctx.req.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx['X-Response-Time'] = `${ms}ms`;
});

// response
app.use(async ctx => {
  ctx.res.end('This is like koa2');
});

app.listen(8000);

```
