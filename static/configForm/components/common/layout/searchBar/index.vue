<template>
  <yl-search-bar
    :limit="formTemplate.limit || 4"
    :model="model"
    :label-show-length="0"
    :width="formTemplate.width || '220px'"
    @search="search"
  >
    <template v-for="(item, i) in components">
      <input v-if="item.type === 'hidden'" :key="i" :name="item.name" :value="item.value" type="hidden" />
      <yl-search-item v-else :key="i" :prop="item.name" :label="item.label" :width="item.width">
        <!-- 输入框 -->
        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.name]"
          size="medium"
          :disabled="!!+item.disabled"
          :placeholder="item.placeholder || '请输入' + item.label"
        ></el-input>
        <!-- 文字 -->
        <span v-else-if="item.type === 'text'">{{ item.value }}</span>
        <!-- 下拉搜索框 -->
        <m-select
          v-else-if="item.type === 'search'"
          v-model="model[item.name]"
          width="100%"
          right-icon="search"
          :label="(item.dataSource && item.dataSource.fieldConfig && item.dataSource.fieldConfig.key) || 'name'"
          :value="(item.dataSource && item.dataSource.fieldConfig && item.dataSource.fieldConfig.value) || 'id'"
          :remote-method="callRemoteMethod(item.dataSource)"
          :placeholder="item.placeholder || `请选择${item.label || ''}`"
          :multiple="!!+item.multiple"
          :disabled="!!+item.disabled"
          :clearable="!!+item.clearable"
          :auto-fill-selected="!!+item.autoFillSelected"
          size="medium"
          v-on="onEvents"
          @selected="handleChange($event, item)"
        ></m-select>
      </yl-search-item>
      <!-- <yl-search-item :key="i + 'j'" :prop="item.name" :label="item.label" :width="item.width"
        ><el-input></el-input
      ></yl-search-item> -->
    </template>
  </yl-search-bar>
</template>
<script>
import { MSelect } from '@/components/mui';
export default {
  components: {
    MSelect
  },
  inject: ['getStore'],
  props: {
    metadata: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      model: {},
      components: []
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
    },
    coreProcessor() {
      return this.getStore()?.state()?.coreProcessor;
    },
    onEvents() {
      const events = {};
      if (this.metadata?._id) {
        this.metadata?.$on?.forEach(v => {
          events[v] = this.handleEvent.bind(this, v, this.metadata._id);
        });
      }
      return events;
    }
  },
  watch: {},
  mounted() {
    this.parseMetadata();
  },
  methods: {
    async parseMetadata() {
      if (this.metadata) {
        this.model = await this.coreProcessor.parseFormModel(this.metadata.components);
      }
      this.components = this.metadata.components;
    },
    search() {
      this.$emit('event', 'search', this.formTemplate._id, this.model);
    },
    callRemoteMethod(dataSource) {
      if (!dataSource) {
        return [];
      }
      return async (keyword = '', page = 1) => {
        const _dataSource = {};
        const params = dataSource.params || [];
        Object.assign(_dataSource, dataSource, {
          params: [
            ...params,
            {
              key: 'keyword',
              value: keyword.trim()
            },
            {
              key: 'page',
              value: page
            }
          ]
        });
        const result = await this.coreProcessor.parseDataSource(_dataSource);
        return result || [];
      };
    },
    handleEvent(event, _id, eventData) {
      this.$emit('event', event, _id, eventData);
    },
    handleChange(data, item) {
      this.$emit('event', 'change', item._id, data);
      this.search();
    },
    // 暴露给外部调用的方法
    getSearchParams() {
      return this.model;
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
