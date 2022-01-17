<template>
  <div>
    <!-- 三元运算符,如果有id传过来就表示的编辑分类,如果没有就是新建分类 -->
    <h1>{{ id ? "编辑" : "新建" }}物品</h1>
    <!-- 比如这里我们希望是横向布局，意思就是名称这两字和输入框在一行 label-width="" 这里面的属性值填的是和左侧的距离 -->
    <!-- 点击保存的时候应该是执行form的submit事件 -->
    <!-- @submit.native.prevent=""在这里的意思是,native表示原生的一个表单,prevent阻止默认提交,不要跳转页面 -->
    <el-form label-width="100px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <!-- 这里的action就是上传的接口地址 这里是动态绑定，所以是加 :  -->
        <!-- :on-success="handleAvatarSuccess"是成功之后做什么 这里我们要做的是把它返回的值赋值给icon -->
        <!-- :before-upload="beforeAvatarUpload"上传之前做什么，比如图片大小上面合不合适，这里不用，先删掉 -->
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="getAuthHeaders()"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <!-- 这里的判断意思是有图片地址就显示图片，没有图片地址就显示那个上传图标 -->
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <!-- 这是上传图标 -->
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <!-- 这个native-type="submit"的意思是表示它原来html里面的类型是一个提交按钮 -->
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {},
  },
  data() {
    return {
      model: {},
    };
  },
  methods: {
    // 接受的参数是res表示服务端的响应，接受的数据是什么
    afterUpload(res) {
      // console.log(res);
      // 因为在接口里面是拼出来了这个url,所以这里可以用,然后展示出来 这里是因为vue里面响应式有问题,不能这样写
      // this.model.icon = res.url
      // 第一个参数是赋值的数据主体,第二个是要赋值的属性,第三个是属性值  , 这个是vue提供的方法叫  显示赋值
      this.$set(this.model, "icon", res.url);
    },
    async save() {
      // // 这里面需要请求一个接口去提交数据,提交时post
      // // 这里是提交到items接口,传递的参数是this.model   平时后面可能就是用Promise的then方法,这里可以用async
      // // 这里就是把异步的回调函数的写法换成了类似同步的写法
      // const res = await this.$http.post('items', this.model)

      // 这里把上面的都注释掉,来做一个判断,如果有那个id的时候就是put,没有就是post  当然这样做接口也是必不可少的
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/items/${this.id}`, this.model);
      } else {
        res = await this.$http.post("rest/items", this.model);
      }
      // 创建完之后跳转到 分类列表
      this.$router.push("/items/list");
      // 同时跳转的时候提示一下保存成功了
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/items/${this.id}`);
      this.model = res.data;
    },
  },
  created() {
    // 这里要执行一个方法去获取数据,就是当点了编辑按钮之后返回到编辑页面,之前对应的数据就会出现在框框里面
    // 当然这个获取数据的方法需要判断一下,如果有了this.id才执行,没有就不执行
    this.id && this.fetch();
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 5rem;
  height: 5rem;
  line-height: 5rem;
  text-align: center;
}
.avatar {
  width: 5rem;
  height: 5rem;
  display: block;
}
</style>
