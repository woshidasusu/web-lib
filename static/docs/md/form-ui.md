# 配置化表单

> 支持配置化的内置组件
>
> 表单类：基于 xxx-ui 组件包裹了一层 xxx
>
> 容器类：可多层嵌套
>
> 通用类：纯净的组件，没有经过包裹或封装

::: demo

```html
<template>
  <div>
    <h3>表单类</h3>

    <h3>容器类</h3>

    <h3>通用类</h3>

    <h3>业务组件 - 调研模块</h3>

    <h3>业务组件 - 任务登记</h3>

    <h3>配置化示例</h3>
    <config-form style="margin-top: 20px" v-if="metadata" :metadata="metadata"></config-form>
  </div>
</template>
<script>
  import configForm from '@/components/config-form';
  import config from '@/components/config-form/designer/metadata';

  export default {
    components: {
      configForm
    },
    data() {
      return {
        checkList: [],
        metadata: '',
        sort: {}
      };
    },
    watch: {
      checkList(newV) {
        const sort = {};
        newV.forEach((v, i) => {
          sort[v] = `(${i + 1})`;
        });
        this.sort = sort;
        this.generateMetadata();
      }
    },
    mounted() {},
    methods: {
      generateMetadata() {
        const metadata = JSON.parse(JSON.stringify(config.formPage));
        this.checkList.forEach((v, i) => {
          if (config[v]) {
            const meta = JSON.parse(JSON.stringify(config[v]));
            metadata.components.push({
              ...meta,
              _id: i + 1
            });
          }
        });
        this.metadata = null;
        setTimeout(() => {
          this.metadata = metadata;
        }, 16);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-checkbox-group .el-checkbox {
    margin-left: 0 !important;
    margin-top: 12px;
    margin-right: 12px;
  }
</style>
```
