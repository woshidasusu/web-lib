<template>
  <div class="container" :style="{ 'margin-left': formTemplate.labelWidth, width: formTemplate.width }">
    <div
      v-for="(items, index) in columns"
      :key="index"
      class="column-container"
      :style="{
        width: itemWidth[index]
      }"
    >
      <template v-for="(item, i) in items">
        <component
          :is="ALL_COMPONENTS[item.type] || ALL_COMPONENTS['element']"
          v-if="!+item.hidden"
          :ref="item._id"
          :key="'c' + index + i"
          :style="item.style"
          :metadata="item"
          :form-model="insideFormModel"
          :type="item.type"
          @event="handleComponentEvent"
        ></component>
      </template>
    </div>
  </div>
</template>

<script>
/**
 * 多列的表单组件
 * components 数组长度即为多列
 */
import ALL_COMPONENTS from '@/components/configForm/components';
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[container]：', ...args);
  }
};
export default {
  props: {
    metadata: {
      type: Object,
      require: true
    },
    formModel: {
      type: [Object, Array],
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      ALL_COMPONENTS: ALL_COMPONENTS
    };
  },
  computed: {
    // 各列数据
    columns() {
      if (this.metadata) {
        return this.metadata.components || [];
      }
      return [];
    },
    formTemplate() {
      return this.metadata || {};
    },
    insideFormModel() {
      if (this.formTemplate.name) {
        return this.formModel[this.formTemplate.name];
      }
      return this.formModel;
    },
    itemWidth() {
      const itemWidths = [];
      const defaultWidth = `calc(${100 / this.columns.length}% - 30px)`;
      this.columns.forEach((v, i) => {
        if (this.formTemplate.itemWidth == null) {
          itemWidths.push(defaultWidth);
        } else if (Array.isArray(this.formTemplate.itemWidth)) {
          itemWidths.push(this.formTemplate.itemWidth[i]);
        } else {
          itemWidths.push(this.formTemplate.itemWidth);
        }
      });
      return itemWidths;
    }
  },
  watch: {
    metadata: {
      handler: function (newV) {
        this.parseMetadata();
      },
      immediate: true
    }
  },
  methods: {
    parseMetadata() {
      log('parseMetadata()', this.metadata);
      // 校验元数据格式的合法性
      if (!this.validateMetadata()) {
        return;
      }
      log('validateMetadata() return true');
      // 解析元数据
    },
    validateMetadata() {
      if (!this.metadata || typeof this.metadata !== 'object') {
        // 非对象类型时，中断后续处理
        return false;
      }
      const { components } = this.metadata;
      if (!components || !components.length) {
        console.error('container 表单组件的 components 字段不能为空');
        return false;
      }
      return true;
    },
    // 处理子组件上抛的事件，参数包括：事件类型，表单项_id，回传的数据
    handleComponentEvent(...args) {
      this.$emit('event', ...args);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.container {
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 24px;

  .column-container {
    flex-shrink: 0;

    &:not(:last-child) {
      margin-right: 30px;
    }
  }
}
</style>
