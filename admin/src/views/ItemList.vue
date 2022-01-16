<template>
  <div>
    <h2>物品列表</h2>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="250"> </el-table-column>
      <el-table-column prop="name" label="物品名称"> </el-table-column>
      <el-table-column prop="icon" label="图标">
        <template slot-scope="scope">
          <!-- 这个scope.row.icon的意思是锁定这一行数据 3rem就是三个字的高度 -->
          <img :src="scope.row.icon" alt="" style="height=3rem;">
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          > -->
          <!-- 这里看与根据自己的喜好改这个type,如果是primary就是带颜色的按钮,如果是text就是文字 -->
          <!-- 这里的scope.row就表示每一行对应的那个id -->
          <el-button
            type="primary"
            size="small"
            @click="$router.push(`/items/edit/${scope.row._id}`)"
            >编辑</el-button
          >
          <!-- 这里直接调用remove方法,把整个一行的数据传给他,然后移除 -->
          <el-button type="primary" size="small" @click="remove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("rest/items");
      this.items = res.data;
    },
    // 只要用到接口都要async
    async remove(row) {
      this.$confirm(`是否确定要删除物品 "${row.name}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.delete(`rest/items/${row._id}`)
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          // 这里删除成功之后要重新获取一下数据.可以理解为刷新一下页面
          this.fetch()
        })
    },
  },
  created() {
    // 这里写这个组件默认进来要做什么事情  这里我们是默认要去获取数据的
    // 执行上面的fetch
    this.fetch();
  },
};
</script>