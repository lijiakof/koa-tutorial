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