# koa-tutorial
Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

* 安装
* Hello Koa
* ABC
    * 级联
    * app.listen
    * app.use
    * error
    * cookies
* 中间件
    * koa-router
    * koa-bodyparser

## 安装

```
npm i koa
Or
yarn add koa
```

## Hello Koa

```
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(3000, () => {
    console.log('http://localhost:3000/');
});
```

## ABC

### 级联
Koa 是一种 AOP（面向切面的编程）模式，它采用所谓的洋葱模型，使用者可以通过级联的方式顺序调用中间件。在使用上类似于 jQuery 的链式调用，但是在调用上更像洋葱一样一层一层从外向内的进入，然后从内向外的出来。这种方式更像 AOP 一样，它更好的解决了异步调用，更加符合 Node 设计初衷，将复杂的逻辑解耦到各个中间件中去，并且是一种高性能的异步 I/O 模式（因为它继承于 event 模块）。

下面的代码是在演示 Koa 的级联方式：

```
const Koa = require('koa');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// response
app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(3000);
```

### app.listen
直接看源代码：https://github.com/koajs/koa/blob/master/lib/application.js

```
const http = require('http');
// ...

listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
}
```

### app.use
将给定的中间件方法添加到此应用程序，看代码：

```
use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this;
}
```

### error
我们可以通过添加 `error` 事件来监听整个程序的错误：

```
app.on('error', err => {
    log.error('server error', err)
});
```

### cookie
我们可以通过 Koa 的上下文来读写 cookie

* ctx.cookies.get(name, [options])
* ctx.cookies.set(name, value, [options])

```
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {

    ctx.cookies.set(
        'cid',
        'hello world',
        {
            domain: 'localhost',  // 写cookie所在的域名
            path: '',       // 写cookie所在的路径
            maxAge: 10 * 60 * 1000, // cookie有效时长
            expires: new Date('2019-03-15'),  // cookie失效时间
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: false  // 是否允许重写
        }
    );
    ctx.body = 'cookie is ok';
});

app.listen(3000, () => {
    console.log('[demo] cookie is starting at port 3000')
});
```

## 中间件

### koa-router
路由中间件是个大框架都提供的，也是非常重要的，它可以让业务逻辑分散到各个不同的资源中去：

```
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/hello', (ctx, next) => {
    ctx.body = 'Hello';
});

router.get('/test', (ctx, next) => {
    ctx.body = 'Test';
});

app
    .use(router.routes())
    .listen(3000, () => {
        console.log('http://localhost:3000/');
    });
```

### koa-bodyparser
用来解析 HTTP body 部分的，支持 json、form 和 text 类型的 body

```
var Koa = require('koa');
var bodyParser = require('koa-bodyparser');

var app = new Koa();
app.use(bodyParser());

app.use(async ctx => {
    // the parsed body will store in ctx.request.body
    // if nothing was parsed, body will be an empty object {}
    ctx.body = ctx.request.body;
});
```

## 总结
Koa.js 作为一个web框架，总结出来只提供了两种能力：

* HTTP 服务
* 中间件机制