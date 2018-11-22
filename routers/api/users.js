// @login & register
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');

const User = require('../../modules/User');

/**
 * $route   GET  api/users/test
 * @desc    返回的请求的json数据
 * @access  public
 */
router.get('/test', (req, res) => {
  res.json({msg:'login works'});
});

/**
 * $route   POST  api/users/register
 * @desc    返回的请求的json数据
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

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar
        });

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

module.exports = router;