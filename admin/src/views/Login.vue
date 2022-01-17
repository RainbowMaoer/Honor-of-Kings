<template>
  <div class="login-container">
    <el-card header="请先登录" class="login-card">
      <!-- native表示监听el-form原生表单事件，prevent是阻止表单的默认提交，不要跳转页面 -->
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {}
    }
  },
  methods: {
    async login() {
      // 这里请求到的数据就是一个token
      const res = await this.$http.post('login', this.model)
      // 然后保存这个token  
      // 这里用最简单的一个方法  就是把返回来的token写入到localStorage 这个是浏览器关闭之后打开还有
      localStorage.token = res.data.token
      // 还有一个就是浏览器关闭之后没有了
      // sessionStorage.token = res.data.token
      this.$router.push('/')
      // 同时弹出一个提示登录成功
      this.$message({
        type: 'success',
        message: '登录成功'
      })
    }
  },
}
</script>

<style>
.login-card {
  width: 25rem;
  margin: 5rem auto;
}
</style>