import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import CategoryEdit from '../views/CategoryEdit.vue'
import CategoryList from '../views/CategoryList.vue'

import ItemEdit from '../views/ItemEdit.vue'
import ItemList from '../views/ItemList.vue'

import HeroEdit from '../views/HeroEdit.vue'
import HeroList from '../views/HeroList.vue'

import ArticleEdit from '../views/ArticleEdit.vue'
import ArticleList from '../views/ArticleList.vue'

import AdEdit from '../views/AdEdit.vue'
import AdList from '../views/AdList.vue'


Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'main',
  component: Main,
  children: [{
      path: '/categories/create',
      component: CategoryEdit
    },
    // 这里让两个不同的地址使用同一个页面组件,
    // 但是这里加一个特殊参数props:true表示比如把这个id变量注入到CategoryEdit里面,然后在对应页面就可以直接用
    // 注意要在对应页面接收props
    {
      path: '/categories/edit/:id',
      component: CategoryEdit,
      props: true
    },
    {
      path: '/categories/list',
      component: CategoryList
    },
    {
      path: '/items/create',
      component: ItemEdit
    },
    {
      path: '/items/edit/:id',
      component: ItemEdit,
      props: true
    },
    {
      path: '/items/list',
      component: ItemList
    },
    {
      path: '/heroes/create',
      component: HeroEdit
    },
    {
      path: '/heroes/edit/:id',
      component: HeroEdit,
      props: true
    },
    {
      path: '/heroes/list',
      component: HeroList
    },
    {
      path: '/articles/create',
      component: ArticleEdit
    },
    {
      path: '/articles/edit/:id',
      component: ArticleEdit,
      props: true
    },
    {
      path: '/articles/list',
      component: ArticleList
    },
    {
      path: '/ads/create',
      component: AdEdit
    },
    {
      path: '/ads/edit/:id',
      component: AdEdit,
      props: true
    },
    {
      path: '/ads/list',
      component: AdList
    }
  ]
}]

const router = new VueRouter({
  routes
})

export default router