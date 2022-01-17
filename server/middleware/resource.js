// 这些中间件搬过来，路径都是要改的，还有auth里面的app要改成req.app
module.exports = options => {
  return async(req, res, next) => {
    // 这一步是因为req.params.resource直接获取是小写的然后是负数，我们安装inflection包然后将它转换成类名就是我们对应的那个模型
    const modelName = require('inflection').classify(req.params.resource)
    // 表示的是给请求对象上面挂载一个属性Model
    req.Model = require(`../models/${modelName}`)
    next()
  }
}