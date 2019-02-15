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


/**
 * 获取评论信息
 * $route   api/posts
 * @method  GET
 * @access  public
 */
router.get('/', (req, res) => {
  Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({nopostsfound: '找不到任何评论信息'}))
});

/**
 * 获取单个评论信息
 * $route   api/posts/:id
 * @method  GET
 * @access  public
 */
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({PostsNotFound: '找不到该评论信息'}))
});

/**
 * 删除单个评论信息
 * $route   api/posts/:id
 * @method  DELETE
 * @access  private
 */
router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  Profile.findOne({user: req.user.id}).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        // 判断是否本人
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({NotAuthorized: '用户非法操作'})
        }

        post.remove().then(() => res.json({success: '删除成功'}))
      })
      .catch(err => res.status(404).json({PostNotFound: '找不到该评论信息'}))
  })
});



module.exports = router;
