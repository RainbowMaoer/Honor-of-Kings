const mongoose = require('mongoose')

// 用它来定义该模型的字段有哪些
const schema = new mongoose.Schema({
  name: { type: String },
  items: [{
    image: { type: String },
    // 这个是图片点击之后需要跳转的url
    url: { type: String },
  }]
})

// 导出的是mongoose的一个模型,哪里需要用到就哪里导入 比如admin里面的index.js
module.exports = mongoose.model('Ad', schema)