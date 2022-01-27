<template>
  <div class="card bg-white p-3 mt-3">
    <div class="d-flex ai-center" :class="{'border-bottom': !plain, 'pb-3': !plain}">
      <i class="iconfont" :class="`icon-${icon}`"></i>
      <div class="fs-xl flex-1 px-2"><strong>{{title}}</strong></div>
      <i class="iconfont icon-Menu" v-if="!plain"></i>
    </div>
    <div class="card-body pt-3">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 这里required: true是必填的意思，表示要用这个card组件就必须填这个标题
    title: {type: String, required: true},
    icon: {type: String, required: true},
    plain: {type: Boolean}
  }
};
</script>

<style lang="scss">
@import '../assets/scss/_variables.scss';
.card {
  border-bottom: 1px solid $border-color;
}
</style>