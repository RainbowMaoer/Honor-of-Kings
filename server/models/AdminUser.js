const mongoose = require('mongoose')

// 用它来定义该模型的字段有哪些
const schema = new mongoose.Schema({
  username: {
    type: String
  },
  // 装一个包，bcrypt  用于对密码进行散列处理，让数据库人员也不知道用户的密码
  password: {
    type: String,
    // 加了这个就是密码在编辑页面不会被查出来
    select: false,
    set(val) {
      // 把这个加密的值传给val, 后面的那个指数越高加密效果越好，但是越耗时 一般再10到12
      // 这个bcrypt的散列是不可逆的散列，一旦保存到数据库就会发生改变，返回来编辑也看不到原来的结果
      return require('bcrypt').hashSync(val, 10)
    }
  }
})

// 导出的是mongoose的一个模型,哪里需要用到就哪里导入 比如admin里面的index.js
module.exports = mongoose.model('AdminUser', schema)