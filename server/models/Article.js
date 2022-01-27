const mongoose = require('mongoose')

// 用它来定义该模型的字段有哪些
const schema = new mongoose.Schema({
  title: { type: String },
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  body: { type: String }
},{
  // 这个是时时间戳，自动生成时间
  timestamps: true
})

// 导出的是mongoose的一个模型,哪里需要用到就哪里导入 比如admin里面的index.js
module.exports = mongoose.model('Article', schema)