// 导出一个函数app,这个函数接受一个app对象,我们在这里就可以使用最外层的那个app,不过要在那里面require一下
module.exports = app => {
  const express = require('express')
  // 这个router是express的一个子路由,当我们需要子路由的时候我们就用它
  // 因为我们需要定义一个子路由,里面有增删改查的各种东西
  const router = express.Router({
    // 这里加这个是因为在下面接口里面需要获取resource，所以要加这个  如果不加。它只能在最下面那个app.use里面获取到
    mergeParams: true
  })
  // 这个代码没法要了，因为这里改成了通用接口，模型也不是固定的，所以要动态传入
  // const Category = require('../../models/Category')

  // 增加数据的接口
  // 给router加一个post方法
  router.post('/', async(req, res) => {
    // 这里面涉及到把数据存进去,所以就需要数据库
    // 创建数据,数据来源就是客户端提交的数据   这里的req.body要想使用的话前面加上await
    const model = await req.Model.create(req.body)
    // 发回给客户端,让客户端知道已经完成了
    res.send(model)
  })

  // 修改数据的接口
  router.put('/:id', async(req, res) => {
    // 通过id去找,找完之后把它更新掉
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  // 删除数据的接口
  router.delete('/:id', async(req, res) => {
    // 通过id去找,找完之后把它更新掉
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    // 这里我们删除之后是不需要回去返回值的,只需要给客户端返回一个成功即可
    res.send({
      success: true
    })
  })

  // 在页面中显示数据的接口
  // 这里是分类列表的接口
  router.get('/', async(req, res) => {
    // // 这里的limit后面的参数是限制数据在10条,这里写不写都可以,不写就是不限制
    // // populate('')这个是关联取出的意思 如果有字段是关联字段的话,我们就路查出来,比如这里的parent 因为在数据库里的分类模型是这么定义的
    // // 这里加了populate('')之后我们得到的就是一个对象,既有id又有name
    // const items = await req.Model.find().populate('parent').limit(10)
    
    // 这里对上面进行修改，把他改成通用的，因为这个比较特殊，不是所有的都会去找它的上级接口
    const queryOptions = {}
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }
    const items = await req.Model.find().setOptions(queryOptions).limit(20)
    res.send(items)
  })

  // 获取已添加的数据的接口
  router.get('/:id', async(req, res) => {
    // id参数来自于req.params.id
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  // 最后把这个子路由挂载到这个上面
  // 这个resource就是动态的，这就是通用接口
  app.use('/admin/api/rest/:resource', async(req, res, next) => {
    // 这一步是因为req.params.resource直接获取是小写的然后是负数，我们安装inflection包然后将它转换成类名就是我们对应的那个模型
    const modelName = require('inflection').classify(req.params.resource)
    // 表示的是给请求对象上面挂载一个属性Model
    req.Model = require(`../../models/${modelName}`)
    next()
  }, router)


  const multer = require('multer')
  // 这里注意这个路径，蛮容易搞错  dirname是绝对地址
  const upload = multer({dest: __dirname + '/../../uploads'})
  // upload.single()表示的是单个文件的上传  字段名就是file  因为在接口里面传的字段名是file 
  // 这个file名字在el-upload里面可以通过一个参数修改
  app.post('/admin/api/upload', upload.single('file'), async(req, res) => {
    // 这里先装一个multer插件
    // 本身在express里面是没有req.file这个东西的,是因为我们加了个multer这个中间键  它会把上传文件的数据赋值到req.file上
    const file = req.file
    // 这里拼出来一个url地址,然后在前端就可以展示出来
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })
}