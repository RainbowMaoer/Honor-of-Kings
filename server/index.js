const express = require('express')

// 再定义一个app,它是express的实例
const app = express()

// 这里是把这个跨域模块引进来,然后后面加一个小括号就是使用它的意思
app.use(require('cors')())
app.use(express.json())


// 引用数据库
require('./plugins/db')(app)
// 引用过来之后是一个函数,所以要执行它并把函数传进去,这里就像一个匿名函数,闭包一样  这样在这个admin里面就有一个app可以用
require('./routes/admin')(app)

// 在3000端口,同时传给它一个回调函数,里面表示启动之后做什么
app.listen(3000, () => {
  console.log('App listening on port 3000!');
})