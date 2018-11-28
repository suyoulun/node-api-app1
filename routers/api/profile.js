const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../modules/Profiles');
const User = require('../../modules/User');

/**
 * $route   api/users/test
 * @method  GET
 * @desc    测试接口
 * @access  public
 */
router.get('/test', (req, res) => {
  res.json({msg:'profile works'});
});

/**
 * $route   api/profile
 * @method  GET
 * @desc    获取用户个人档案
 * @access  private
 */
router.get('/', passport.authenticate('jwt', {session:false}), (req, res) => {
  const errors = {};
  Profile.findOne({user: req.user.id})
    .then(profile => {
      if (!profile) {
        errors.noprofile = '该用户的信息不存在'
        return res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(errors));
});


module.exports = router;
