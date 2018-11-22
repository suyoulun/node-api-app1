const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();


// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// 引入配置 mongodb
const db = require('./config/database').mongoURL;
// 连接 mongodb
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log(db + '  数据库连接成功  MongoDB Connected......'))
  .catch(err => console.log(db + '  数据库连接失败', err));

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// 引入 users.js
const users = require('./routers/api/users');
// 使用routers
app.use('/api/users', users);


app.listen(port, () => {
  console.log(`Server runing on port         http://localhost:${port}`);
});