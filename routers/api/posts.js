// @评论 点赞
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../modules/Post');
const Profile = require('../../modules/Profiles');

// 引入验证方法
const validatePostInput = require('../../validation/post');


/**
 * 测试接口
 * $route   api/posts/test
 * @method  GET
 * @access  public
 */
router.get('/test', (req, res) => {
  res.json({msg:'post works'});
});


/**
 * 创建一个评论接口
 * $route   api/posts
 * @method  POST
 * @access  Private
 */
router.post('/', passport.authenticate('jwt', {session:false}), (req, res) => {
  // 验证请求参数
  const {errors, isValid} = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const newPost = new Post({
    user: req.user.id,
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
  });

  newPost.save().then(post => res.json(post));
});


module.exports = router;
