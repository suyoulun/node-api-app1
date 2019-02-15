const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const port = process.env.PORT || 5000;


// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// 引入配置 mongodb
const db = require('./config/database').mongoURL;
// 连接 mongodb
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log(db + '  数据库连接成功  MongoDB Connected......'))
  .catch(err => console.log(db + '  数据库连接失败', err));


// 使用中间件实现允许跨域
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  response.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  next();
});


// 引入路由模块
const users = require('./routers/api/users');
const profile = require('./routers/api/profile');
const posts = require('./routers/api/posts');
// 使用routers
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


// 初始化 passport
app.use(passport.initialize());
require('./config/passport.js')(passport);


// 开启服务
app.listen(port, () => {
  console.log(`【${new Date().toLocaleString()}】Server runing on port    http://localhost:${port}`);
});