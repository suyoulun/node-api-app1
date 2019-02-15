const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput (data) {
  let errors = {};

  // 确保值为字符串
  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, {min: 10, max: 300})) {
    errors.text = '文本字符需大于10位且小于300位'
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = '文本不能为空'
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
};