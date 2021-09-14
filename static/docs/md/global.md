# 全局方法

::: demo

```html
<template>
  <div>
    <el-button @click="loading">this.$loading()</el-button>
    <el-button @click="loading">this.$loading.close()</el-button>
    <el-button @click="imagePreview">this.$imagePreview()</el-button>
    <el-button @click="imagePreview">指令（v-image-preview）</el-button>
  </div>
</template>
<script>
  export default {
    methods: {
      loading() {
        this.$loading();
        setTimeout(() => {
          this.closeLoading();
        }, 2000);
      },
      closeLoading() {
        this.$loading.close();
      },
      imagePreview() {
        // 参考 vant 的 ImagePreivew 用法
        this.$imagePreview(['https://cn.vuejs.org/images/logo.svg']);
      }
    }
  };
</script>
```
