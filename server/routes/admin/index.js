// 导出一个函数app,这个函数接受一个app对象,我们在这里就可以使用最外层的那个app,不过要在那里面require一下
module.exports = app => {
  const express = require('express')
  const jwt = require('jsonwebtoken')
  const AdminUser = require('../../models/AdminUser')
  const assert = require('http-assert')
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
  // 这里是分类列表的接口     中间加一个处理函数，叫做中间键
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

  // 这里是把中间件封装在这  登录授权或者登录校验中间件
  // const authMiddleware = async(req, res, next) => {
  //   // 前端标准的获取请求头是大写，后端获取请求头是小写  它们两会自动对应  因为获取到的有那个bearer，所以这里分割一下
  //   // 然后pop一下提取最后面这个元素，也就是token那一长串字符
  //   const token = String(req.headers.authorization || '').split(' ').pop()
  //   // 判断token是否为空
  //   assert(token, 401, '请先登录')    // 请提供jwt token
  //   // 提取token数据   有个decode是解密出来，但是不会验证对错，不安全  所以用verify
  //   const {id} = jwt.verify(token, app.get('secret'))
  //   // 判断id是否存在
  //   assert(id, 401, '请先登录')   // 无效的jwt token
  //   // console.log(id);
  //   // 这里是去找是否真的有这个用户，万一是伪造的也说不定   这里把这个东西挂载到req上去，后续也可以使用
  //   req.user = await AdminUser.findById(id)
  //   // console.log(req.user);
  //   assert(req.user, 401, '请先登录')
  //   await next()
  // }

  // 这里因为抽离出去了，我注释掉这里的，然后导入一下  同样的下面的中间件也是这样
  // 这样的话可以复用，有扩展性，别的地方需要用到就直接导入   因为是封装的函数，所以调用的时候要加()
  const authMiddleware = require('../../middleware/auth')
  const resourceMiddleware = require('../../middleware/resource')
  
  // // 这里把获取模型的中间件封装在这
  // const resourceMiddleware = async(req, res, next) => {
  //   // 这一步是因为req.params.resource直接获取是小写的然后是负数，我们安装inflection包然后将它转换成类名就是我们对应的那个模型
  //   const modelName = require('inflection').classify(req.params.resource)
  //   // 表示的是给请求对象上面挂载一个属性Model
  //   req.Model = require(`../../models/${modelName}`)
  //   next()
  // }

  // 最后把这个子路由挂载到这个上面
  // 这个resource就是动态的，这就是通用接口
  app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)


  const multer = require('multer')
  // 这里注意这个路径，蛮容易搞错  dirname是绝对地址
  const upload = multer({dest: __dirname + '/../../uploads'})
  // upload.single()表示的是单个文件的上传  字段名就是file  因为在接口里面传的字段名是file 
  // 这个file名字在el-upload里面可以通过一个参数修改
  app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async(req, res) => {
    // 这里先装一个multer插件
    // 本身在express里面是没有req.file这个东西的,是因为我们加了个multer这个中间键  它会把上传文件的数据赋值到req.file上
    const file = req.file
    // 这里拼出来一个url地址,然后在前端就可以展示出来
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })


  // 登录的路由
  app.post('/admin/api/login', async(req, res) => {
    // 前端把用户名和密码传过来，这里做校验看是否正确  正确就返回给前端一个token(令牌) 一串密钥，然后让他保存这个密钥
    // 后续就通过这个密钥来证明自己是谁
    // 这里用到解构赋值
    const { username, password } = req.body
    // 1、根据用户名找用户
    // select('+password')表示查的时候把password这个字段取出来，因为之前加了select：false，所以下面直接取是去不到的，只能这样
    // 前缀-是排除，+是强制选择
    const user = await AdminUser.findOne({username}).select('+password')           // findOne是找一条的意思
    // 因为装了http-assert这个包，所以这里写法就简单了
    // 三个参数，第一个确保用户存在，第二个：如果不存在就抛出错误码，第三个：抛出错误信息
    assert(user, 422, '用户不存在')
    // if (!user) {
    //   return res.status(422).send({
    //     message: '用户不存在'
    //   })
    // }
    
    // 2、校验密码
    // 因为是用bcrypt加密的，所以也用它来校验
    const isValid = require('bcrypt').compareSync(password, user.password)
    assert(isValid, 422, '密码错误')
    // if (!isValid) {
    //   return res.status(422).send({
    //     message: '密码错误'
    //   })
    // }
    
    // 3、返回token
    // 这里先安装一个模块，jsonwebtoken  这是现在比较流行的做web的token验证的  引用放在了最上面
    // 这个sign第一个参数里面可以放任何数据，这里为了简单注释掉下面的，只放id
      // _id: user._id,
      // username: user.username
      // 第二个参数：密钥  随便给一个字符串就可以  这应该是一个全局的东西，所放到server里面的index.js里面
      // 这里获取时候的get只能传一个参数，和定义路由的那个歌get名字是冲突的，这里要区分清除 这里是获取配置
    const token = jwt.sign({ id: user._id }, app.get('secret'))
    // 这里也可以返回用户名，比如点击登录显示欢迎某某某，这里就要顺便把用户名也返回
    res.send({token})
  })



  // 错误处理函数  用这个来捕获异常  这也是个中间键，但是这比平时的中间键多一个参数，有四个参数
  app.use(async(err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}