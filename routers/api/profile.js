const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../modules/Profiles');
const User = require('../../modules/User');

// 引入验证方法
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

/**
 * 测试接口
 * $route   api/users/test
 * @method  GET
 * @access  public
 */
router.get('/test', (req, res) => {
  res.json({msg:'profile works'});
});

/**
 * 获取用户个人档案
 * $route   api/profile
 * @method  GET
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
 * 创建和编辑用户个人档案
 * $route   api/profile/
 * @method  POST
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
 * 通过 handle 获取用户个人档案
 * $route   api/profile/handle/:handle
 * @method  GET
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
 * 通过 user_id 获取用户个人档案
 * $route   api/profile/user/:user_id
 * @method  GET
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
 * 获取所有用户个人档案
 * $route   api/profile/all
 * @method  GET
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

/**
 * 添加个人工作经历
 * $route   api/profile/experience
 * @method  POST
 * @access  private
 */
router.post('/experience', passport.authenticate('jwt', {session:false}), (req, res) => {
  // 验证请求参数
  const {errors, isValid} = validateExperienceInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors)
  }

  Profile.findOne({user: req.user.id})
    .then(profile => {
      const newExp = {
        current: req.body.current,
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        description: req.body.description
      };

      profile.experience.unshift(newExp);

      profile.save()
        .then(profile => res.json(profile))
        .catch(err => res.status(400).json(err))
    })
});

/**
 * 添加个人教育经历
 * $route   api/profile/education
 * @method  POST
 * @access  private
 */
router.post('/education', passport.authenticate('jwt', {session:false}), (req, res) => {
  // 验证请求参数
  const {errors, isValid} = validateEducationInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors)
  }

  Profile.findOne({user: req.user.id})
    .then(profile => {
      const newEdu = {
        current: req.body.current,
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        description: req.body.description
      };

      profile.education.unshift(newEdu);

      profile.save()
        .then(profile => res.json(profile))
        .catch(err => res.status(400).json(err))
    })
});

/**
 * 删除个人工作经历
 * $route   api/profile/experience/:exp_id
 * @method  DELETE
 * @access  private
 */
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session:false}), (req, res) => {

  Profile.findOne({user: req.user.id})
    .then(profile => {
      const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

      profile.experience.splice(removeIndex, 1);

      profile.save().then(profile => res.json(profile))
    })
    .catch(err => res.status(404).json(err))
});

/**
 * 删除个人教育经历
 * $route   api/profile/education/:edu_id
 * @method  DELETE
 * @access  private
 */
router.delete('/education/:edu_id', passport.authenticate('jwt', {session:false}), (req, res) => {

  Profile.findOne({user: req.user.id})
    .then(profile => {
      const removeIndex = profile.education.map(item => item.id).indexOf(req.params.exp_id)

      profile.education.splice(removeIndex, 1);

      profile.save().then(profile => res.json(profile))
    })
    .catch(err => res.status(404).json(err))
});

/**
 * 删除整个用户信息
 * $route   api/profile
 * @method  DELETE
 * @access  private
 */
router.delete('/', passport.authenticate('jwt', {session:false}), (req, res) => {

  Profile.findOneAndRemove({user: req.user.id})
    .then(() => {
      User.findOneAndRemove({_id: req.user.id})
        .then(() => {
          res.json({success: true, msg: '删除成功'})
        })
    })
    .catch(err => res.status(404).json(err))
});


module.exports = router;
