import axios from 'axios'
import Vue from 'vue'
import router from './router'

const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api'
})

http.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 行业规范要在前面加'Bearer '  Bearer后面有个空格，一下搞错找半天
  if (localStorage.token) {
    config.headers.Authorization = 'Bearer ' + localStorage.token
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


// 这就是给整个请求加一个拦截器  全局监听
http.interceptors.response.use(res => {
  return res
}, err => {
  // 当有错误信息的时候才弹出，做一个判断，这里更严谨
  if (err.response.data.message) {
    Vue.prototype.$message({
      type: 'error',
      message: err.response.data.message
    })
    if (err.response.status === 401) {
      router.push('/login')
    }
  }
  return Promise.reject(err)
})


export default http