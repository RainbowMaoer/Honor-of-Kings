<template>
  <div>
    <!-- 三元运算符,如果有id传过来就表示的编辑分类,如果没有就是新建分类 -->
    <h1>{{ id ? "编辑" : "新建" }}英雄</h1>
    <!-- 比如这里我们希望是横向布局，意思就是名称这两字和输入框在一行 label-width="" 这里面的属性值填的是和左侧的距离 -->
    <!-- 点击保存的时候应该是执行form的submit事件 -->
    <!-- @submit.native.prevent=""在这里的意思是,native表示原生的一个表单,prevent阻止默认提交,不要跳转页面 -->
    <el-form label-width="100px" @submit.native.prevent="save">
      <!-- 这个border-card可以改变样式,变得好看一点 -->
      <el-tabs type="border-card" value="basic">
        <!-- 这个value和name相同就表示默认显示这个 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-form-item label="名称">
            <el-input v-model="model.name"></el-input>
          </el-form-item>
          <el-form-item label="称号">
            <el-input v-model="model.title"></el-input>
          </el-form-item>
          <el-form-item label="头像">
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
              <img v-if="model.avatar" :src="model.avatar" class="avatar" />
              <!-- 这是上传图标 -->
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="背景图">
            <!-- 这里的action就是上传的接口地址 这里是动态绑定，所以是加 :  -->
            <!-- :on-success="handleAvatarSuccess"是成功之后做什么 这里我们要做的是把它返回的值赋值给icon -->
            <!-- :before-upload="beforeAvatarUpload"上传之前做什么，比如图片大小上面合不合适，这里不用，先删掉 -->
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="getAuthHeaders()"
              :show-file-list="false"
              :on-success="res => $set(model, 'banner', res.url)"
            >
              <!-- 这里的判断意思是有图片地址就显示图片，没有图片地址就显示那个上传图标 -->
              <img v-if="model.banner" :src="model.banner" class="avatar" />
              <!-- 这是上传图标 -->
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="类型">
            <!-- 加了multiple就是控制它可以多选 -->
            <el-select v-model="model.categories" multiple>
              <el-option
                v-for="item in categories"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难度">
            <!-- el-rate是打分的组件 show-score是显示分数  -->
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.difficult"
            ></el-rate>
          </el-form-item>
          <el-form-item label="技能">
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.skills"
            ></el-rate>
          </el-form-item>
          <el-form-item label="攻击">
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.attack"
            ></el-rate>
          </el-form-item>
          <el-form-item label="生存">
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.survive"
            ></el-rate>
          </el-form-item>
          <el-form-item label="顺风出装">
            <!-- 加了multiple就是控制它可以多选 -->
            <el-select v-model="model.items1" multiple>
              <el-option
                v-for="item in items"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="逆风出装">
            <!-- 加了multiple就是控制它可以多选 -->
            <el-select v-model="model.items2" multiple>
              <el-option
                v-for="item in items"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用技巧">
            <el-input type="textarea" v-model="model.usageTips"></el-input>
          </el-form-item>
          <el-form-item label="对抗技巧">
            <el-input type="textarea" v-model="model.battleTips"></el-input>
          </el-form-item>
          <el-form-item label="团战思路">
            <el-input type="textarea" v-model="model.teamTips"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="技能" name="skills">
          <el-button size="small" @click="model.skills.push({})"
            ><i class="el-icon-plus"></i> 添加技能</el-button
          >
          <!-- 显示为flex布局  el-row定义行  el-col定义列-->
          <el-row type="flex" style="flex-wrap: wrap">
            <!-- 这里面的属性我用过,软件工程实践的时候,就是响应式 随着屏幕宽度改变而改变布局 -->
            <el-col :md="12" v-for="(item, i) in model.skills" :key="i">
              <el-form-item label="技能名称">
                <el-input v-model="item.name"></el-input>
              </el-form-item>
              <el-form-item label="技能图标">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :headers="getAuthHeaders()"
                  :show-file-list="false"
                  :on-success="(res) => $set(item, 'icon', res.url)"
                >
                  <!-- 这里的判断意思是有图片地址就显示图片，没有图片地址就显示那个上传图标 -->
                  <img v-if="item.icon" :src="item.icon" class="avatar" />
                  <!-- 这是上传图标 -->
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="技能描述">
                <el-input type="textarea" v-model="item.description"></el-input>
              </el-form-item>
              <el-form-item label="技能提示">
                <el-input type="textarea" v-model="item.tips"></el-input>
              </el-form-item>
              <el-form-item>
                <!-- 第i个位置,删除一个 -->
                <el-button
                  size="small"
                  type="danger"
                  @click="model.skills.splice(i, 1)"
                  >删除</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="最佳搭档" name="partners">
          <el-button size="small" @click="model.partners.push({})"
            ><i class="el-icon-plus"></i>添加搭档</el-button
          >
          <!-- 显示为flex布局  el-row定义行  el-col定义列-->
          <el-row type="flex" style="flex-wrap: wrap">
            <!-- 这里面的属性我用过,软件工程实践的时候,就是响应式 随着屏幕宽度改变而改变布局 -->
            <el-col :md="12" v-for="(item, i) in model.partners" :key="i">
              <el-form-item label="搭档名称">
                <!-- filterable这个属性是可以在下拉菜单里面搜索 -->
                <el-select filterable v-model="item.hero">
                  <el-option
                    v-for="hero in heroes"
                    :key="hero._id"
                    :value="hero._id"
                    :label="hero.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="搭档描述">
                <el-input type="textarea" v-model="item.description"></el-input>
              </el-form-item>
              <el-form-item>
                <!-- 第i个位置,删除一个 -->
                <el-button
                  size="small"
                  type="danger"
                  @click="model.partners.splice(i, 1)"
                  >删除</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-form-item style="margin-top: 1rem">
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
      categories: [],
      items: [],
      heroes: [],
      model: {
        name: "",
        avatar: "",
        scores: {
          difficult: 0,
          skills: 0,
          attack: 0,
          survive: 0,
        },
        skills: [],
        partners: [],
      },
    };
  },
  methods: {
    // 接受的参数是res表示服务端的响应，接受的数据是什么
    afterUpload(res) {
      // console.log(res);
      // 因为在接口里面是拼出来了这个url,所以这里可以用,然后展示出来 这里是因为vue里面响应式有问题,不能这样写
      this.model.avatar = res.url;
      // 第一个参数是赋值的数据主体,第二个是要赋值的属性,第三个是属性值  , 这个是vue提供的方法叫  显示赋值
      // this.$set(this.model, "avatar", res.url);
      // 上面这么做的原因之前讲过,是因为在data里面的model没有定义数据,我们也可以在里面提前把数据定义好
    },
    async save() {
      // // 这里面需要请求一个接口去提交数据,提交时post
      // // 这里是提交到heroes接口,传递的参数是this.model   平时后面可能就是用Promise的then方法,这里可以用async
      // // 这里就是把异步的回调函数的写法换成了类似同步的写法
      // const res = await this.$http.post('heroes', this.model)

      // 这里把上面的都注释掉,来做一个判断,如果有那个id的时候就是put,没有就是post  当然这样做接口也是必不可少的
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/heroes/${this.id}`, this.model);
      } else {
        res = await this.$http.post("rest/heroes", this.model);
      }
      // 创建完之后跳转到 分类列表
      this.$router.push("/heroes/list");
      // 同时跳转的时候提示一下保存成功了
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/heroes/${this.id}`);
      // this.model = res.data;
      // 因为它会把服务端的数据完整的替换到model上,所以会导致scores数据没有,所以,这里要换一种赋值方式'
      // 这个方法是,先有一个空对象,然后把this.model放进去,然后再把获取到的res.data放进去,这里就不是替换了,是合并
      // 所以这里可以尝试es6的扩展运算符的写法
      this.model = Object.assign({}, this.model, res.data);
    },
    async fetchCategories() {
      const res = await this.$http.get(`rest/categories`);
      // 这里我们只需要英雄分类,到时候我们会处理一下
      this.categories = res.data;
    },
    async fetchItems() {
      const res = await this.$http.get(`rest/items`);
      // 这里我们只需要英雄分类,到时候我们会处理一下
      this.items = res.data;
    },
    async fetchHeroes() {
      const res = await this.$http.get(`rest/heroes`);
      // 这里我们只需要英雄分类,到时候我们会处理一下
      this.heroes = res.data;
    },
  },
  created() {
    this.fetchCategories();
    this.fetchItems();
    this.fetchHeroes();
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
/* 这里大概是Main组件里面的样式重叠了这个里面的,具体原因不清楚,我这里给它加点权重就ok了 */
i.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 5rem;
  height: 5rem;
  line-height: 5rem;
  text-align: center;
}
.avatar {
  /* width: 5rem; */
  height: 5rem;
  display: block;
}
</style>
