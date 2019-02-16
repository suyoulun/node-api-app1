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
 * @param   text  [String]  评论内容
 * @param   name  [String]  用户名
 * @param   avatar  [String]  头像
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


/**
 * 评论点赞
 * $route   api/posts/like/:id
 * @method  post
 * @access  private
 */
router.post('/like/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  Profile.findOne({user: req.user.id}).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        // 判断是否已点赞
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
          return res.status(400).json({msg: '该用户已点赞'})
        }

        post.likes.unshift({user: req.user.id});
        post.save().then(post => res.json(post))
      })
      .catch(err => res.status(404).json({msg: '找不到该评论'}))
  })
});

/**
 * 取消评论点赞
 * $route   api/posts/unlike/:id
 * @method  post
 * @access  private
 */
router.post('/unlike/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  Profile.findOne({user: req.user.id}).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        // 判断是否已点赞
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
          return res.status(400).json({msg: '该用户未点赞'})
        }

        const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        post.save().then(post => res.json(post))
      })
      .catch(err => res.status(404).json({msg: '找不到该评论'}))
  })
});


/**
 * 添加评论
 * $route   api/posts/comment/:id
 * @method  post
 * @access  private
 * @param   text  [String]  评论内容
 * @param   name  [String]  用户名
 * @param   avatar  [String]  头像
 */
router.post('/comment/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  // 验证请求参数
  const {errors, isValid} = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors)
  }

  Post.findById(req.params.id).then(post => {
    const newComment = {
      user: req.user.id,
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
    };
    post.comments.unshift(newComment);
    post.save().then(post => res.json(post));
  })
    .catch(err => res.status(404).json({msg: '添加评论错误'}));

});


/**
 * 删除评论
 * $route   api/posts/comment/:id/:comment_id
 * @method  delete
 * @access  private
 */
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session:false}), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);

      // 判断是否有该评论
      if (removeIndex < 0) {
        return res.status(400).json({msg: '该评论不存在'})
      }

      post.comments.splice(removeIndex, 1);
      post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({msg: '删除评论错误'}))
});


module.exports = router;
