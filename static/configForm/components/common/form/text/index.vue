<template>
  <!-- 文本框的必填校验默认不显示错误信息 -->
  <el-form-item
    :label="formTemplate.label"
    :prop="formTemplate.name"
    :label-width="formTemplate.labelWidth"
    :required="!!+formTemplate.required"
    :rules="
      formTemplate.validateRules || {
        required: true,
        message: ' ',
        trigger: 'change'
      }
    "
  >
    <span>{{ formTemplate.showValue || model }}</span>
  </el-form-item>
</template>

<script>
const debug = window.__debug_log__;
const log = (...args) => {
  if (debug) {
    console.log('[text]：', ...args);
  }
};
export default {
  props: {
    metadata: {
      type: Object,
      require: true
    },
    formModel: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      insideModel: ''
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
    },
    model: {
      get() {
        if (this.formTemplate.name) {
          return this.formModel[this.formTemplate.name];
        }
        return this.insideModel;
      },
      set(value) {
        if (this.formTemplate.name) {
          this.formModel[this.formTemplate.name] = value;
        }
        this.insideModel = value;
      }
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
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
