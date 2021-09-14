<template>
  <div v-loading="loading">
    <template v-for="(item, i) in components">
      <slot :name="'before' + item._id" v-bind="metadataMap['before' + item._id]"></slot>
      <component
        :is="ALL_COMPONENTS[item.type] || ALL_COMPONENTS['element']"
        v-if="!+item.hidden"
        :ref="item._id"
        :key="i"
        :metadata="item"
        :type="item.type"
        @event="handleComponentEvent"
      ></component>
      <slot :name="'after' + item._id" v-bind="metadataMap['after' + item._id]"></slot>
    </template>
  </div>
</template>

<script>
import CoreProcessor from './core';
import ALL_COMPONENTS from '@/components/configForm/components';

/**
 * 配置化-列表页
 */
const debug = false;
const log = (...args) => {
  if (debug) {
    console.log('[listPage]：', ...args);
  }
};
export default {
  components: {},
  inject: ['getStore'],
  props: {},
  data() {
    return {
      loading: false,
      metadata: null,
      ALL_COMPONENTS: ALL_COMPONENTS, // 所有支持的表单项列表
      components: []
    };
  },
  computed: {
    metadataMap() {
      return this.getStore()?.state()?.metadataMap || {};
    }
  },
  watch: {},
  async mounted() {
    this.metadata = this.getStore()?.state()?.metadata;
    this.parseMetadata();
  },
  destroyed() {},
  methods: {
    // 解析元数据
    async parseMetadata() {
      this.loading = true;
      log('parseMetadata()', this.metadata);
      // 先校验元数据格式的合法性
      if (!this.validateMetadata()) {
        this.loading = false;
        return;
      }

      let coreProcessor = new CoreProcessor();
      coreProcessor = this.getStore()?.state()?.coreProcessor;
      // 解析所有组件的联动信息、校验规则等，并以 id 做缓存方便存取
      await coreProcessor.parseComponents(this.metadata.components);
      // 处理表单组件的初始化规则
      coreProcessor.handleInitRules();
      // 渲染表单组件
      this.components = this.metadata.components;

      setTimeout(() => {
        this.loading = false;
      }, 0);
    },
    validateMetadata() {
      if (!this.metadata || typeof this.metadata !== 'object') {
        // 非对象类型时，中断后续处理
        return false;
      }
      if (!this.metadata.components || !this.metadata.components.length) {
        // components 数组为空时，中断后续处理
        return false;
      }
      log('validateMetadata() - return true');
      return true;
    },
    // 处理子组件上抛的事件，参数包括：事件类型，表单项_id，回传的数据
    handleComponentEvent(event, formItemId, eventData) {
      log('handleComponentEvent()', { event, formItemId, eventData });
      let coreProcessor = new CoreProcessor();
      coreProcessor = this.getStore()?.state()?.coreProcessor;
      coreProcessor.handleComponentEvent(event, formItemId, eventData);
      this.$emit('event', event, formItemId, eventData);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
