// @login & register
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys.js');

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
 * @param   email     邮箱
 * @param   name      用户名
 * @param   password   密码
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
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
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

/**
 * $route  /api/users/login
 * @method  POST
 * @param   email     邮箱
 * @param   password  密码
 * @desc    用户登录
 * @return  token jwt passport
 * @access  public
 */
router.post('/login', (req, res) => {
  const {email, password} = req.body;

  // 查询数据库
  User.findOne({email})
    .then(user => {
      if (!user) {
        return res.status(400).json({msg: '用户不存在'})
      }

      // 密码匹配
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // jwt.sign('规则', '加密名字', '过期时间', '箭头函数');
          const rule = {id: user.id, name: user.name};
          jwt.sign(rule, keys.secretOrKey, {expiresIn: 1800}, (err, token) => {
            if (err) throw err;
            res.json({
              success: true,
              token: 'Bearer ' + token // 固定名称
            })
          });
          // res.json({msg: '登录成功'})
        } else {
          res.status(400).json({msg: '密码错误'})
        }
      });
    })
});

/**
 * $route  /api/users/current
 * @method  GET
 * @header  Token
 * @desc    获取用户信息
 * @return  用户信息
 * @access  private
 */
router.get('/current', passport.authenticate('jwt', {session:false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
});

module.exports = router;
