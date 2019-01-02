const Koa = require('koa');
const app = new Koa();
const mongoose = require('mongoose');

mongoose.connect('mongodb://ecotech:ecotech888@10.0.11.253:20000/test', {
    useNewUrlParser: true
});

const Schema = mongoose.Schema;
const testSchema = new Schema({
    hotelAlias: String,
    district: String,
    businessZone: String,
    cityName: String
}, { collection: 'hotelInfo', versionKey: false });

var hotelInfo = mongoose.model('hotelInfo', testSchema);
// testModel.findOne({}, (res) => {
//     console.log(res);
// });

// hotelInfo.findOne({ "cityId": "0201"}, (err, res) => {
//     console.log(err);
//     console.log(res);
// });

mongoose.connection.on('connected', function () {
    console.log('数据库连接成功');
});

mongoose.connection.on('error', function (err) {
    console.log('数据库连接失败');
});

app.use(async ctx => {
    let json = await hotelInfo.findOne({ 'cityId': '0201' })
    ctx.body = json;
});

app.listen(3000, () => {
    console.log('http://localhost:3000/');
});