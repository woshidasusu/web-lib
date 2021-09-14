<template>
  <div class="layout-container">
    <div style="margin-bottom: 20px">
      <span class="title">{{ title || '元数据' }}</span>
      <yl-space style="margin-left: 20px">
        <el-button type="text" @click="doCopy">复制</el-button>
        <el-button v-if="type === 'local'" type="text" @click="doTransform"
          >格式转换成字符串（提供给后端去写 sql 更新服务端元数据）</el-button
        >
      </yl-space>
    </div>
    <div class="code">{{ metadata }}</div>
  </div>
</template>

<script>
import { copyAtClipboard } from '@/utils/tools';
export default {
  components: {},
  props: {},
  data() {
    return {
      type: 'local',
      title: '',
      metadata: ''
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    const type = this.$route.query?.type;
    this.type = type;
    let data = localStorage.getItem('__metadata');
    data = JSON.parse(data);
    if (type === 'local') {
      this.title = '本地元数据';
      this.metadata = JSON.stringify(data?.metadata, ' ', 2);
    } else if (type === 'remote') {
      this.title = '服务器元数据';
      this.metadata = JSON.stringify(JSON.parse(data?.standard), ' ', 2);
    }
  },
  destroyed() {},
  methods: {
    doCopy() {
      copyAtClipboard(this.metadata);
      this.$tips('复制成功');
    },
    doTransform() {
      copyAtClipboard(JSON.stringify(JSON.stringify(JSON.parse(this.metadata))));
      this.$tips('格式转换并复制成功');
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.layout-container {
  padding: 20px 40px;

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .code {
    white-space: pre-wrap;
  }
}
</style>
