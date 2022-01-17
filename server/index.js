const express = require('express')

// 再定义一个app,它是express的实例
const app = express()

// app.set表示在当前express实例上设置一个变量   这里的值按道理是应该放到环境里面去的，这里是为了方便学习，不搞那么复杂
app.set('secret', '1e1edqwdq')



// 这里是把这个跨域模块引进来,然后后面加一个小括号就是使用它的意思
app.use(require('cors')())
app.use(express.json())
// 这里表示uploads下面的东西都是静态文件
// 这里这样设置之后就可以让我们uploads里面的文件可以通过/uploads文件夹访问
// 里面的图片可能是为了安全,把2后缀名都去了,是二进制文件
app.use('/uploads', express.static(__dirname + '/uploads'))


// 引用数据库
require('./plugins/db')(app)
// 引用过来之后是一个函数,所以要执行它并把函数传进去,这里就像一个匿名函数,闭包一样  这样在这个admin里面就有一个app可以用
require('./routes/admin')(app)

// 在3000端口,同时传给它一个回调函数,里面表示启动之后做什么
app.listen(3000, () => {
  console.log('App listening on port 3000!');
})