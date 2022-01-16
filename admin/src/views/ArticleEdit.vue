<template>
  <div>
    <!-- 三元运算符,如果有id传过来就表示的编辑分类,如果没有就是新建分类 -->
    <h1>{{ id ? "编辑" : "新建" }}文章</h1>
    <!-- 比如这里我们希望是横向布局，意思就是名称这两字和输入框在一行 label-width="" 这里面的属性值填的是和左侧的距离 -->
    <!-- 点击保存的时候应该是执行form的submit事件 -->
    <!-- @submit.native.prevent=""在这里的意思是,native表示原生的一个表单,prevent阻止默认提交,不要跳转页面 -->
    <el-form label-width="100px" @submit.native.prevent="save">
      <el-form-item label="所属分类">
        <el-select v-model="model.categories" multiple>
          <!-- :label="item.name"表示它页面上显示的内容,也就是我们看得到的,
          :value="item._id"这个是选中的值,我们在数据库里面是id进行管理,而不是name -->
          <el-option
            v-for="item in categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <!-- 给输入框来个双向绑定  这里用浏览器插件可以检测到 -->
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="详情">
        <!-- 给输入框来个双向绑定  这里用浏览器插件可以检测到 -->
        <vue-editor
          useCustomImageHandler
          @image-added="handleImageAdded"
          v-model="model.body"
        ></vue-editor>
      </el-form-item>
      <el-form-item>
        <!-- 这个native-type="submit"的意思是表示它原来html里面的类型是一个提交按钮 -->
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  props: {
    id: {},
  },
  components: {
    VueEditor,
  },
  data() {
    return {
      model: {},
      categories: [],
    };
  },
  methods: {
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      // An example of using FormData
      // NOTE: Your key could be different such as:
      // formData.append('file', file)

      const formData = new FormData();
      formData.append("file", file);

      const res = await this.$http.post("upload", formData);
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
      
      // axios({
      //   url: "https://fakeapi.yoursite.com/images",
      //   method: "POST",
      //   data: formData,
      // })
      //   .then((result) => {
      //     const url = result.data.url; // Get url from response
      //     Editor.insertEmbed(cursorLocation, "image", url);
      //     resetUploader();
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    async save() {
      // // 这里面需要请求一个接口去提交数据,提交时post
      // // 这里是提交到categories接口,传递的参数是this.model   平时后面可能就是用Promise的then方法,这里可以用async
      // // 这里就是把异步的回调函数的写法换成了类似同步的写法
      // const res = await this.$http.post('categories', this.model)

      // 这里把上面的都注释掉,来做一个判断,如果有那个id的时候就是put,没有就是post  当然这样做接口也是必不可少的
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/articles/${this.id}`, this.model);
      } else {
        res = await this.$http.post("rest/articles", this.model);
      }
      // 创建完之后跳转到 分类列表
      this.$router.push("/articles/list");
      // 同时跳转的时候提示一下保存成功了
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/articles/${this.id}`);
      this.model = res.data;
    },
    async fetchCategories() {
      // 这里为了图方便,用了和前面分类页面相同的接口
      const res = await this.$http.get(`rest/categories`);
      this.categories = res.data;
    },
  },
  created() {
    this.fetchCategories();
    // 这里要执行一个方法去获取数据,就是当点了编辑按钮之后返回到编辑页面,之前对应的数据就会出现在框框里面
    // 当然这个获取数据的方法需要判断一下,如果有了this.id才执行,没有就不执行
    this.id && this.fetch();
  },
};
</script>