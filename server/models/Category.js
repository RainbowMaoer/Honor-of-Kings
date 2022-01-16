const mongoose = require('mongoose')

// 用它来定义该模型的字段有哪些
const schema = new mongoose.Schema({
  name: { type: String },
  // 这里是上级分类的字段,数据类型是一个比较特殊的数据类型,在mongodb数据库里面的id就是这个数据类型
  // 同时后面跟一个ref,表示它关联的是哪一个模型  之所以这么写,是因为这个分类要调出它的上级分类,他知道去哪找
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }
})

// 导出的是mongoose的一个模型,哪里需要用到就哪里导入 比如admin里面的index.js
module.exports = mongoose.model('Category', schema)