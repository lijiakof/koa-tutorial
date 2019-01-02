const Sequelize = require('sequelize');
const Koa = require('koa');

const sequelize = new Sequelize('space_database', 'ecotech', 'iesjo9um', {
    host: 'test-space1bjs.cvrlck3hdzic.rds.cn-north-1.amazonaws.com.cn',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const model = sequelize.define('TEAM_BUILDING', {
    title: Sequelize.STRING,
    price: Sequelize.DOUBLE,
    //priceUnit: Sequelize.STRING,
    city: Sequelize.STRING
    //totalSellNum: Sequelize.NUMBER
}, {
    freezeTableName: true,    
    tableName: 'TEAM_BUILDING',
    timestamps: false
});

// model.findAll({
//     limit: 10,
// }).then(res => {
//     console.log(JSON.stringify(res));
// });

const app = new Koa();

var cacheData = null;

app.use(async ctx => {
    //ctx.query.limit
    if (!cacheData) {
        cacheData = await model.findAll({
            limit: 10,
        });
    }
    // const data = await model.findAll({
    //     limit: 10,
    // });

    ctx.body = JSON.stringify(cacheData);
});

app.listen(3000, () => {
    console.log('http://localhost:3000/');
});
