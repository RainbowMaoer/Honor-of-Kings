<template>
  <div>
    <!-- 三元运算符,如果有id传过来就表示的编辑分类,如果没有就是新建分类 -->
    <h1>{{ id ? "编辑" : "新建" }}广告位</h1>
    <!-- 比如这里我们希望是横向布局，意思就是名称这两字和输入框在一行 label-width="" 这里面的属性值填的是和左侧的距离 -->
    <!-- 点击保存的时候应该是执行form的submit事件 -->
    <!-- @submit.native.prevent=""在这里的意思是,native表示原生的一个表单,prevent阻止默认提交,不要跳转页面 -->
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <!-- 给输入框来个双向绑定  这里用浏览器插件可以检测到 -->
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="广告">
        <el-button size="small" @click="model.items.push({})"
          ><i class="el-icon-plus"></i> 添加广告</el-button
        >
        <!-- 显示为flex布局  el-row定义行  el-col定义列-->
        <el-row type="flex" style="flex-wrap: wrap">
          <!-- 这里面的属性我用过,软件工程实践的时候,就是响应式 随着屏幕宽度改变而改变布局 -->
          <el-col :md="24" v-for="(item, i) in model.items" :key="i">
            <el-form-item label="跳转链接(URL)">
              <el-input v-model="item.url"></el-input>
            </el-form-item>
            <el-form-item label="图片" style="margin-top: 0.5rem;">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="getAuthHeaders()"
                :show-file-list="false"
                :on-success="(res) => $set(item, 'image', res.url)"
              >
                <!-- 这里的判断意思是有图片地址就显示图片，没有图片地址就显示那个上传图标 -->
                <img v-if="item.image" :src="item.image" class="avatar" />
                <!-- 这是上传图标 -->
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <!-- 第i个位置,删除一个 -->
              <el-button
                size="small"
                type="danger"
                @click="model.items.splice(i, 1)"
                >删除</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
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
      model: {
        items: [],
      },
    };
  },
  methods: {
    async save() {
      // // 这里面需要请求一个接口去提交数据,提交时post
      // // 这里是提交到categories接口,传递的参数是this.model   平时后面可能就是用Promise的then方法,这里可以用async
      // // 这里就是把异步的回调函数的写法换成了类似同步的写法
      // const res = await this.$http.post('categories', this.model)

      // 这里把上面的都注释掉,来做一个判断,如果有那个id的时候就是put,没有就是post  当然这样做接口也是必不可少的
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/ads/${this.id}`, this.model);
      } else {
        res = await this.$http.post("rest/ads", this.model);
      }
      // 创建完之后跳转到 分类列表
      this.$router.push("/ads/list");
      // 同时跳转的时候提示一下保存成功了
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/ads/${this.id}`);
      // this.model = res.data;
      this.model = Object.assign({}, this.model, res.data);
    },
  },
  created() {
    // 这里要执行一个方法去获取数据,就是当点了编辑按钮之后返回到编辑页面,之前对应的数据就会出现在框框里面
    // 当然这个获取数据的方法需要判断一下,如果有了this.id才执行,没有就不执行
    this.id && this.fetch();
  },
};
</script>

<style>
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
  /* width: 5rem; */
  height: 5rem;
  line-height: 5rem;
  text-align: center;
}
.avatar {
  min-width: 5rem;
  height: 5rem;
  display: block;
}
</style>
