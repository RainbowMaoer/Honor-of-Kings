// 这个文件夹是把中间件都抽离到middleware里面了
module.exports = options => {
  const jwt = require('jsonwebtoken')
  const AdminUser = require('../models/AdminUser')
  const assert = require('http-assert')
  return async(req, res, next) => {
    // 前端标准的获取请求头是大写，后端获取请求头是小写  它们两会自动对应  因为获取到的有那个bearer，所以这里分割一下
    // 然后pop一下提取最后面这个元素，也就是token那一长串字符
    const token = String(req.headers.authorization || '').split(' ').pop()
    // 判断token是否为空
    assert(token, 401, '请先登录')    // 请提供jwt token
    // 提取token数据   有个decode是解密出来，但是不会验证对错，不安全  所以用verify
    const {id} = jwt.verify(token, req.app.get('secret'))
    // 判断id是否存在
    assert(id, 401, '请先登录')   // 无效的jwt token
    // console.log(id);
    // 这里是去找是否真的有这个用户，万一是伪造的也说不定   这里把这个东西挂载到req上去，后续也可以使用
    req.user = await AdminUser.findById(id)
    // console.log(req.user);
    assert(req.user, 401, '请先登录')
    await next()
  }
}