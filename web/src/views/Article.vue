<template>
  <!-- 这里加v-if就会比较严谨，model存在的时候再去加载内容，这是一种写法，如果把下面的model类型写成{}就不需要这个v-if了 -->
  <div class="page-article" v-if="model">
    <div class="d-flex py-3 px-2 border-bottom">
      <!-- 我用的字体图标只有一个，因为只下载了一个 -->
      <div class="iconfont icon-Menu text-blue"></div>
      <strong class="flex-1 text-blue pl-2">
        {{ model.title }}
      </strong>
      <div class="text-grey fs-xs">2022/01/20</div>
    </div>
    <div v-html="model.body" class="px-3 body fs-lg"></div>
    <div class="px-3 border-top py-3">
      <div class="d-flex ai-center">
        <i class="iconfont icon-Menu"></i>
        <strong class="text-blue fs-lg ml-1">相关资讯</strong>
      </div>
      <div class="pt-2">
        <router-link
          class="py-1"
          tag="div"
          :to="`/articles/${item._id}`"
          v-for="item in model.related"
          :key="item._id"
          >{{ item.title }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { required: true },
  },
  data() {
    return {
      model: null,
    };
  },
  watch: {
    // 两种写法 id变化之后就执行一遍fetch，因为那个页面被创建之后不会重复执行fetch
    id: 'fetch',
    // id() {
    //   this.fetch()
    // }
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`articles/${this.id}`);
      this.model = res.data;
    },
  },
  created() {
    this.fetch();
  },
};
</script>

<style lang="scss">
.page-article {
  .icon-Menu {
    font-size: 1.6923rem;
  }
  .body {
    img {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>
