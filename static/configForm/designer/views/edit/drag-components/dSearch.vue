<template>
  <m-select
    :style="{ width: data.width || '100%' }"
    width="100%"
    right-icon="search"
    :placeholder="data.placeholder || `请选择${data.label || ''}`"
    :disabled="!!+data.disabled"
    size="medium"
  >
  </m-select>
</template>

<script>
import { MSelect } from '@/components/mui';
export default {
  components: { MSelect },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  async mounted() {},
  destroyed() {},
  methods: {}
};
</script>

<style lang="scss" scoped></style>
