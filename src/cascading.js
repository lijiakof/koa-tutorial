const Koa = require('koa');
const app = new Koa();

//app.keys = ['im a newer secret', 'i like turtle'];
//app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
    console.log(`${ctx.ip}`);
    console.log(`${ctx.url}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.on('error', err => {
    log.error('server error', err)
});

app.listen(3000, () => {
    console.log('http://localhost:3000/');
});