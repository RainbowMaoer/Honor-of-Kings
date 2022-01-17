import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'


Vue.config.productionTip = false

import http from './http'
// 这样子把它加到vue原型上,我们就可以在任意页面使用this.$http去访问数据请求接口
Vue.prototype.$http = http

// 用Vue.mixin定义一个全局的代码块，这玩意就类似Vue实例一样，里面可以有很多东西
Vue.mixin({
  computed: {
    uploadUrl() {
      return this.$http.defaults.baseURL + '/upload'
    }
  },
  methods: {
    getAuthHeaders() {
      return {
        Authorization: `Bearer ${localStorage.token || ''}`
      }
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
