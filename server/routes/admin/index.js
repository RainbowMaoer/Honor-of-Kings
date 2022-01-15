// 导出一个函数app,这个函数接受一个app对象,我们在这里就可以使用最外层的那个app,不过要在那里面require一下
module.exports = app => {
  const express = require('express')
  // 这个router是express的一个子路由,当我们需要子路由的时候我们就用它
  // 因为我们需要定义一个子路由,里面有增删改查的各种东西
  const router = express.Router()
  const Category = require('../../models/Category')

  // 增加数据的接口
  // 给router加一个post方法
  router.post('/categories', async(req, res) => {
    // 这里面涉及到把数据存进去,所以就需要数据库
    // 创建数据,数据来源就是客户端提交的数据   这里的req.body要想使用的话前面加上await
    const model = await Category.create(req.body)
    // 发回给客户端,让客户端知道已经完成了
    res.send(model)
  })

  // 修改数据的接口
  router.put('/categories/:id', async(req, res) => {
    // 通过id去找,找完之后把它更新掉
    const model = await Category.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  // 删除数据的接口
  router.delete('/categories/:id', async(req, res) => {
    // 通过id去找,找完之后把它更新掉
    await Category.findByIdAndDelete(req.params.id, req.body)
    // 这里我们删除之后是不需要回去返回值的,只需要给客户端返回一个成功即可
    res.send({
      success: true
    })
  })

  // 在页面中显示数据的接口
  // 这里是分类列表的接口
  router.get('/categories', async(req, res) => {
    // 这里的limit后面的参数是限制数据在10条,这里写不写都可以,不写就是不限制
    // populate('')这个是关联取出的意思 如果有字段是关联字段的话,我们就路查出来,比如这里的parent 因为在数据库里的分类模型是这么定义的
    // 这里加了populate('')之后我们得到的就是一个对象,既有id又有name
    const items = await Category.find().populate('parent').limit(10)
    res.send(items)
  })

  // 获取已添加的数据的接口
  router.get('/categories/:id', async(req, res) => {
    // id参数来自于req.params.id
    const model = await Category.findById(req.params.id)
    res.send(model)
  })

  // 最后把这个子路由挂载到这个上面
  app.use('/admin/api', router)
}