const {
  populate, where
} = require('../../models/AdminUser')

module.exports = app => {
  const router = require('express').Router()
  // 这里示范一下用mongoose来引入
  const mongoose = require('mongoose')
  const Category = mongoose.model('Category')
  const Article = mongoose.model('Article')
  // const Article = require('../../models/Article')

  const Hero = mongoose.model('Hero')

  // 这里偷懒导入新闻数据
  router.get('/news/init', async (req, res) => {
    const parent = await Category.findOne({
      name: '新闻资讯'
    })
    // lean()表示取纯粹的json，js对象或者数组  不带任何mongoose里面的对象
    const cats = await Category.find().where({
      // 这里是限制，这个上级分类是  新闻资讯
      parent: parent
    }).lean()
    const newTitles = ["虎牙春节福利，好礼拿不停", "元歌皮肤设计大赛-你问我答 如何正确投稿？", "阿宽x王者荣耀 合作款来袭！新年开好局，有团有阿宽", "元歌皮肤设计大赛精彩创意赏析第七期", "免费领 新春生活福利", "助力冰雪运动发展，数智体育迎来全面爆发", "奥运冠军、KPL选手齐聚一堂，颁奖盛典今晚18：00精彩开启", "挑战者杯预报丨秋决重演！武汉eStar战广州TTG谁能捧杯", "广州TTG夺得2022第三届王者荣耀微博杯总冠军", "候选人公布！年度最佳阵容最佳选手即将揭晓"]
    const newsList = newTitles.map(title => {
      // 这里的slice(0)的意思是复制一份原来的数组，目的是不影响原数组，然后后面就是随机排序
      const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5)
      return {
        // 这里是随机取两条数据
        categories: randomCats.slice(0, 2),
        title: title
      }
    })
    // 这个表示以任意条件去清空数据库
    await Article.deleteMany({})
    // 这个是插入数据
    await Article.insertMany(newsList)
    res.send(newsList)
  })

  // 新闻列表接口
  router.get('/news/list', async (req, res) => {
    // // 以分类为主体，关联新闻去把内容调出来
    // const parent = await Category.findOne({
    //   name: '新闻资讯'
    // }).populate({
    //   path: 'children',
    //   populate: {
    //     path: 'newsList'
    //   }
    // }).lean()
    // 聚合查询
    const parent = await Category.findOne({
      name: '新闻资讯'
    })
    // 这个就是mongodb里面的聚合查询  非常强大，可以同时执行好几次查询 聚合查询的参数叫聚合管道
    const cats = await Category.aggregate([
      // match条件查询
      {
        $match: {
          parent: parent._id
        }
      },
      // lookup类似关系型数据库里面的join，可以以一个东西为主体去查另外的集合
      {
        $lookup: {
          // 这个就是集合名字，这个名字其实在创建数据库表的时候省略了，一般在最后哪个schema后面还有个参数就是集合名字，默认是模型名字的小写复数形式
          from: 'articles',
          // 下面这个有点像定义的虚拟字段
          // 下面两表示本地键对应外地键
          localField: '_id',
          foreignField: 'categories',
          // as就是起个名字
          as: 'newsList'
        }
      },
      {
        $addFields: {
          // 这里的slice有点像数组里面的slice，但好像不同
          // 我们这里的意思是限制上面查询出来的东西，因为上面查询出来的数据有的多有的少，这里我们只要五条数据
          newsList: {$slice: ['$newsList', 5]}
        }
      }
    ])
    const subCats = cats.map(v => v._id)
    // 这里再上面数组前面再加一个，这个就是直接再数据库里面找五条数据，不需要加限制条件
    cats.unshift({
      name: '热门',
      newsList: await Article.find().where({
        categories: {$in: subCats}
      }).populate('categories').limit(5).lean()
    })

    cats.map(cat => {
      cat.newsList.map(news => {
        news.categoryName = (cat.name === '热门') ? news.categories[0].name : cat.name
        return news
      })
      return cat
    })
    res.send(cats)
  })

  
  // 下面这一长串代码在浏览器控制台输入就可以导出王者荣耀英雄相关信息
  // $$('.hero-nav > li').map((li, i) => {
  //   return {
  //     name: li.innerText,
  //     heroes: $$('li', $$('.hero-list')[i]).map(el => {
  //       return {
  //         name: $$('h3', el)[0].innerHTML,
  //         avatar: $$('img', el)[0].src
  //       }
  //     })
  //   }
  // })
  // 然后JSON.stringfy(把上面的内容放进去就可以得到字符串)


  // 导入英雄数据 这依然只是个测试接口，我们仅仅为了方便来导入数据的，真是开发不会用到的
  router.get('/heroes/init', async (req, res) => {
    // 先清空英雄列表
    await Hero.deleteMany({})
    const rawData = [{"name":"热门","heroes":[{"name":"鲁班七号","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg"},{"name":"孙尚香","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg"},{"name":"妲己","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg"},{"name":"瑶","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg"},{"name":"马可波罗","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg"},{"name":"安琪拉","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg"},{"name":"孙悟空","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg"},{"name":"甄姬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg"},{"name":"亚瑟","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg"},{"name":"貂蝉","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg"}]},{"name":"战士","heroes":[{"name":"赵云","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg"},{"name":"墨子","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg"},{"name":"钟无艳","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg"},{"name":"吕布","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg"},{"name":"夏侯惇","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg"},{"name":"曹操","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/128/128.jpg"},{"name":"典韦","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/129/129.jpg"},{"name":"宫本武藏","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/130/130.jpg"},{"name":"达摩","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg"},{"name":"老夫子","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/139/139.jpg"},{"name":"关羽","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/140/140.jpg"},{"name":"程咬金","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg"},{"name":"露娜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg"},{"name":"花木兰","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg"},{"name":"橘右京","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg"},{"name":"亚瑟","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg"},{"name":"孙悟空","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg"},{"name":"刘备","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/170/170.jpg"},{"name":"杨戬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/178/178.jpg"},{"name":"雅典娜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/183/183.jpg"},{"name":"哪吒","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/180/180.jpg"},{"name":"铠","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg"},{"name":"苏烈","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg"},{"name":"梦奇","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg"},{"name":"裴擒虎","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg"},{"name":"狂铁","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/503/503.jpg"},{"name":"孙策","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg"},{"name":"李信","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/507/507.jpg"},{"name":"盘古","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/529/529.jpg"},{"name":"云中君","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg"},{"name":"曜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/522/522.jpg"},{"name":"马超","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg"},{"name":"蒙恬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/527/527.jpg"},{"name":"夏洛特","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/536/536.jpg"},{"name":"司空震","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/537/537.jpg"},{"name":"云缨","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/538/538.jpg"}]},{"name":"法师","heroes":[{"name":"小乔","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/106/106.jpg"},{"name":"墨子","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg"},{"name":"妲己","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg"},{"name":"嬴政","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/110/110.jpg"},{"name":"高渐离","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/115/115.jpg"},{"name":"孙膑","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg"},{"name":"扁鹊","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/119/119.jpg"},{"name":"芈月","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg"},{"name":"周瑜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/124/124.jpg"},{"name":"甄姬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg"},{"name":"武则天","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/136/136.jpg"},{"name":"貂蝉","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg"},{"name":"安琪拉","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg"},{"name":"露娜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg"},{"name":"姜子牙","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/148/148.jpg"},{"name":"王昭君","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/152/152.jpg"},{"name":"张良","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/156/156.jpg"},{"name":"不知火舞","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg"},{"name":"钟馗","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg"},{"name":"诸葛亮","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190.jpg"},{"name":"干将莫邪","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/182/182.jpg"},{"name":"女娲","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/179/179.jpg"},{"name":"杨玉环","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/176/176.jpg"},{"name":"弈星","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/197/197.jpg"},{"name":"米莱狄","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/504/504.jpg"},{"name":"司马懿","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg"},{"name":"沈梦溪","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/312/312.jpg"},{"name":"上官婉儿","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg"},{"name":"嫦娥","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg"},{"name":"西施","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/523/523.jpg"},{"name":"司空震","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/537/537.jpg"},{"name":"金蝉","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/540/540.jpg"}]},{"name":"坦克","heroes":[{"name":"廉颇","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/105/105.jpg"},{"name":"庄周","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg"},{"name":"刘禅","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg"},{"name":"钟无艳","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg"},{"name":"白起","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/120/120.jpg"},{"name":"芈月","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg"},{"name":"吕布","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg"},{"name":"夏侯惇","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg"},{"name":"达摩","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg"},{"name":"项羽","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135.jpg"},{"name":"程咬金","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg"},{"name":"刘邦","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/149/149.jpg"},{"name":"亚瑟","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg"},{"name":"牛魔","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg"},{"name":"张飞","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg"},{"name":"太乙真人","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg"},{"name":"东皇太一","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg"},{"name":"铠","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg"},{"name":"苏烈","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg"},{"name":"梦奇","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg"},{"name":"孙策","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg"},{"name":"盾山","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg"},{"name":"嫦娥","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg"},{"name":"猪八戒","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/511/511.jpg"},{"name":"蒙恬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/527/527.jpg"},{"name":"阿古朵","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/533/533.jpg"}]},{"name":"刺客","heroes":[{"name":"赵云","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg"},{"name":"阿轲","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/116/116.jpg"},{"name":"李白","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131.jpg"},{"name":"貂蝉","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg"},{"name":"韩信","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg"},{"name":"兰陵王","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/153/153.jpg"},{"name":"花木兰","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg"},{"name":"不知火舞","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg"},{"name":"娜可露露","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/162/162.jpg"},{"name":"橘右京","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg"},{"name":"孙悟空","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg"},{"name":"百里守约","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg"},{"name":"百里玄策","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/195/195.jpg"},{"name":"裴擒虎","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg"},{"name":"元歌","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/125/125.jpg"},{"name":"司马懿","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg"},{"name":"上官婉儿","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg"},{"name":"云中君","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg"},{"name":"马超","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg"},{"name":"镜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/531/531.jpg"},{"name":"澜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/528/528.jpg"},{"name":"云缨","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/538/538.jpg"},{"name":"暃","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/542/542.jpg"}]},{"name":"射手","heroes":[{"name":"孙尚香","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg"},{"name":"鲁班七号","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg"},{"name":"马可波罗","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg"},{"name":"狄仁杰","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/133/133.jpg"},{"name":"后羿","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg"},{"name":"李元芳","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/173/173.jpg"},{"name":"虞姬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/174/174.jpg"},{"name":"成吉思汗","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/177/177.jpg"},{"name":"黄忠","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/192/192.jpg"},{"name":"百里守约","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg"},{"name":"公孙离","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/199/199.jpg"},{"name":"伽罗","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/508/508.jpg"},{"name":"蒙犽","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/524/524.jpg"},{"name":"艾琳","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/155/155.jpg"}]},{"name":"辅助","heroes":[{"name":"庄周","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg"},{"name":"刘禅","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg"},{"name":"孙膑","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg"},{"name":"牛魔","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg"},{"name":"张飞","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg"},{"name":"钟馗","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg"},{"name":"蔡文姬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184.jpg"},{"name":"太乙真人","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg"},{"name":"大乔","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/191/191.jpg"},{"name":"东皇太一","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg"},{"name":"鬼谷子","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/189/189.jpg"},{"name":"明世隐","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/501/501.jpg"},{"name":"盾山","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg"},{"name":"瑶","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg"},{"name":"鲁班大师","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/525/525.jpg"},{"name":"阿古朵","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/533/533.jpg"},{"name":"金蝉","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/540/540.jpg"}]}]
    
    // 这地方要区分好for循环里面的in和of，in必须是索引值，但是of可以是任意值
    for (let cat of rawData) {
      if (cat.name === '热门') {
        // 这里做一个判断的意思是，跳过热门里面的数据  continue表示直接进入下一轮循环
        continue
      }
      // 这里暂时不考虑效率问题  这个是找到当前分类在数据库中对应的数据
      const category = await Category.findOne({
        name: cat.name
      })
      cat.heroes = cat.heroes.map(hero => {
        // 这里其实应该赋值的是category的id，但是mongoose足够智能，会自动识别然后填入
        hero.categories = [category]
        return hero
      })

      // 录入英雄
      await Hero.insertMany(cat.heroes)
    }
    res.send(await Hero.find())
  })

  // 英雄列表接口
  router.get('/heroes/list', async (req, res) => {
    // 聚合查询
    const parent = await Category.findOne({
      name: '英雄分类'
    })
    // 这个就是mongodb里面的聚合查询  非常强大，可以同时执行好几次查询 聚合查询的参数叫聚合管道
    const cats = await Category.aggregate([
      // match条件查询
      {
        $match: {
          parent: parent._id
        }
      },
      // lookup类似关系型数据库里面的join，可以以一个东西为主体去查另外的集合
      {
        $lookup: {
          // 这个就是集合名字，这个名字其实在创建数据库表的时候省略了，一般在最后哪个schema后面还有个参数就是集合名字，默认是模型名字的小写复数形式
          from: 'heroes',
          // 下面这个有点像定义的虚拟字段
          // 下面两表示本地键对应外地键
          localField: '_id',
          foreignField: 'categories',
          // as就是起个名字
          as: 'heroList'
        }
      },
      // 这里注释掉，但是不删，和上面的新闻资讯对比一下，因为新闻我们限制只需要五条，但是这个不一样，不需要限制
      // {
      //   $addFields: {
      //     // 这里的slice有点像数组里面的slice，但好像不同
      //     // 我们这里的意思是限制上面查询出来的东西，因为上面查询出来的数据有的多有的少，这里我们只要五条数据
      //     heroList: {$slice: ['$heroList', 5]}
      //   }
      // }
    ])
    const subCats = cats.map(v => v._id)
    // 这里再上面数组前面再加一个，这个就是直接再数据库里面找五条数据，不需要加限制条件
    cats.unshift({
      name: '热门',
      heroList: await Hero.find().where({
        categories: {$in: subCats}
      }).limit(10).lean()
    })

    res.send(cats)
  });

  // 显示新闻详情的接口
  router.get('/articles/:id', async (req, res) => {
    const data = await Article.findById(req.params.id).lean()
    // lean()是把它改成一个纯粹的json对象
    // 这是追加一条字段，而且限制该字段在相同的类型里面找
    data.related = await Article.find().where({
      // title: {$ne: Article.title},
      categories: {$in: data.categories}
    }).limit(2)
    res.send(data)
  })

  // 显示英雄详情的接口
  router.get('/heroes/:id', async (req, res) => {
    // populate('categories')可以把整个分类有关的信息都调出来
    const data = await Hero.findById(req.params.id).populate('categories items1 items2 partners.hero').lean()
    res.send(data)
  })
  

  app.use('/web/api', router)
}