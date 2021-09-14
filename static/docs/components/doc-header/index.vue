<template>
  <header class="header-container">
    <div class="title">
      <span>组件使用示例</span>
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #f3f4f5;
  .title {
    font-weight: 500;
    font-size: 30px;
  }
}
</style>
