const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput (data) {
  let errors = {};

  // 确保值为字符串
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  if (!Validator.isLength(data.handle, {min:2, max: 40})) {
    errors.handle = '用户名长度为2至40个字符'
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'handle不能为空'
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = 'status不能为空'
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'skills不能为空'
  }

  if (!isEmpty(data.website) && !Validator.isURL(data.website)) {
    errors.website = 'url地址不合法'
  }

  if (!isEmpty(data.tengxunkt) && !Validator.isURL(data.tengxunkt)) {
    errors.tengxunkt = 'url地址不合法'
  }

  if (!isEmpty(data.wangyikt) && !Validator.isURL(data.wangyikt)) {
    errors.wangyikt = 'url地址不合法'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
};