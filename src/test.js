const JustKoa = require('./just-koa');

const app = new JustKoa();

app.use(async ctx => {
    ctx.body = 'Hello JustKoa';
});

app.listen(3000, () => {
    console.log('http://localhost:3000');
});