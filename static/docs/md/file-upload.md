# 文件上传

> 支持前端直传的文件上传组件

::: demo

```html
<template>
  <div>
    <file-upload v-model="fileList" multiple accept="*/*" max-count="5"></file-upload>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileList: [
          {
            url: 'https://img01.yzcdn.cn/vant/leaf.jpg',
            status: 'uploading',
            message: '上传中...'
          },
          {
            url: 'https://img01.yzcdn.cn/vant/tree.jpg',
            status: 'failed',
            message: '上传失败'
          }
        ]
      };
    },
    watch: {
      fileList(newV) {
        console.error('watch(fileList)', newV);
      }
    },
    methods: {}
  };
</script>
```
