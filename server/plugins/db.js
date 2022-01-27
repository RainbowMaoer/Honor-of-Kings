module.exports = app => {
  const mongoose = require('mongoose')
  // mongose去连接数据库
  mongoose.connect('mongodb://127.0.0.1:27017/test1', {
    useNewUrlParser: true
  })

  require('require-all')(__dirname + '/../models')
}