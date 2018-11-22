// @login & register
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const gravatar = require('gravatar');

// 用户数据模型
const User = require('../../modules/User');

/**
 * $route   api/users/test
 * @method  GET
 * @desc    测试接口
 * @access  public
 */
router.get('/test', (req, res) => {
  res.json({msg:'login works'});
});

/**
 * $route   api/users/register
 * @method  POST
 * @desc    注册用户
 * @access  public
 */
router.post('/register', (req, res) => {
  // console.log(req.body);

  // 查询数据库中是否拥有该邮箱
  User.findOne({email: req.body.email})
    .then((user) => {
      if (user) {
        return res.status(400).json({msg: '邮箱已被注册！'});
      } else {
        let avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});

        // 创建用户
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar
        });

        // 加密密码
        bcryptjs.genSalt(10, (err, salt) => {
          bcryptjs.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

module.exports = router;