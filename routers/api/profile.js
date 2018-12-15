const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../modules/Profiles');
const User = require('../../modules/User');

// 引入验证方法
const validateProfileInput = require('../../validation/profile');

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
    .populate('user', ['name', 'avatar']) // 显示user表里的数据
    .then(profile => {
      if (!profile) {
        errors.noprofile = '该用户的信息不存在'
        return res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err));
});

/**
 * $route   api/profile/
 * @method  POST
 * @desc    创建和编辑用户个人档案
 * @access  private
 */
router.post('/', passport.authenticate('jwt', {session:false}), (req, res) => {
  // 验证请求参数
  const {errors, isValid} = validateProfileInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.status) profileFields.status = req.body.status;

  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  // skills - 数组转换
  if(typeof req.body.skills !== "undefined"){
    profileFields.skills = req.body.skills.split(",");
  }

  if(req.body.wechat) profileFields.social.wechat = req.body.wechat;
  if(req.body.QQ) profileFields.social.QQ = req.body.QQ;
  if(req.body.tengxunkt) profileFields.social.tengxunkt = req.body.tengxunkt;
  if(req.body.wangyikt) profileFields.social.wangyikt = req.body.wangyikt;

  Profile.findOne({user: req.user.id}).then(profile => {
    if (profile) {
      // 用户信息存在，执行更新方法
      Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true}).then(profile => {
        res.json(profile)
      });
    } else {
      // 用户信息不存在，执行创建方法
      Profile.findOne({handle: profileFields.handle}).then(profile => {
        if (profile) {
          errors.handle = '该用户的handle个人信息已存在，请勿重新创建'
          res.status(400).json(errors)
        } else {
          new Profile(profileFields).save().then(profile => res.json(profile))
        }
      })
    }
  })
});

/**
 * $route   api/profile/handle/:handle
 * @method  GET
 * @desc    通过 handle 获取用户个人档案
 * @access  public
 */
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({handle: req.params.handle})
    .populate('user', ['name', 'avatar']) // 显示user表里的数据
    .then(profile => {
      if (!profile) {
        errors.noprofile = '未找到该用户的信息'
        return res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err));
});

/**
 * $route   api/profile/user/:user_id
 * @method  GET
 * @desc    通过 user_id 获取用户个人档案
 * @access  public
 */
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({user: req.params.user_id})
    .populate('user', ['name', 'avatar']) // 显示user表里的数据
    .then(profile => {
      if (!profile) {
        errors.noprofile = '未找到该用户的信息'
        return res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err));
});


/**
 * $route   api/profile/all
 * @method  GET
 * @desc    获取所有用户个人档案
 * @access  public
 */
router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user', ['name', 'avatar']) // 显示user表里的数据
    .then(profile => {
      if (!profile) {
        errors.noprofile = '没有任何用户信息'
        return res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err));
});


module.exports = router;
