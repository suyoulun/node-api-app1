if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURL: 'mongodb://test:test123456@ds261072.mlab.com:61072/restful-app-prod'
  }
} else {
  module.exports = {
    mongoURL: 'mongodb://localhost/restful-app'
  }
}