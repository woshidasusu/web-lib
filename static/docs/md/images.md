# 图片资源

> assets/images 目录下引入的图片资源列表

::: demo

```html
<template>
  <div style="display: flex; flex-wrap: wrap">
    <div class="image-item" v-for="(item,i) in images" :key="i">
      <el-image style="width: 120px; height: 120px" :src="item" :preview-src-list="images"> </el-image>
      <a title="点击复制代码" @click="copy(imageNames[i])">{{imageNames[i]}}</a>
    </div>
  </div>
</template>
<script>
  const images = [];
  const requireFiles = require.context(
    // 搜索 images 目录
    '../../assets/images/',
    // 在子目录检索
    true
  );

  requireFiles.keys().forEach(fileName => {
    const name = fileName.substr(fileName.lastIndexOf('/') + 1);
    console.error(name);
    images.push(name);
  });
  export default {
    data() {
      return {
        images: [],
        imageNames: images
      };
    },
    mounted() {
      images.forEach(v => {
        this.images.push(require('@/assets/images/' + v));
      });
    },
    methods: {
      copy(text) {
        text = `require('@/assets/images/${text}')`;
        this.$utils.copyClipboard(text);
        this.$message('复制成功：' + text);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .image-item {
    text-align: center;
    width: 120px;
    margin-top: 10px;
    &:not(:last-child) {
      margin-right: 40px;
    }
    a {
      word-break: break-all;
    }
  }
  a {
    cursor: pointer;
  }
</style>
```
