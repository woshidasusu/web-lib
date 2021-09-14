<template>
  <el-aside class="aside-container" min-width="240px">
    <div class="nav-list">
      <div v-for="(group, groupIndex) in routerConfig" :key="groupIndex" class="nav-box">
        <div class="nav-title">
          {{ group.title }}
        </div>
        <template v-if="group.children && group.children.length">
          <router-link
            v-for="(item, itemIndex) in group.children"
            :key="itemIndex"
            class="nav-item"
            active-class="active"
            :to="item.path"
          >
            {{ item.title }}
          </router-link>
        </template>
      </div>
    </div>
  </el-aside>
</template>

<script>
import docRouterConfig from '../../doc-router-config.js';
export default {
  data() {
    return {
      routerConfig: docRouterConfig
    };
  }
};
</script>

<style lang="scss" scoped>
.aside-container {
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  z-index: 1;
  background-color: #ffffff;
  overflow: hidden;
  overflow-y: auto;
  border-right: 1px solid #f3f4f5;
}
.nav-list {
  display: block;
  padding: 40px 0;
}
.nav-box + .nav-box {
  margin-top: 12px;
}
.nav-title {
  display: block;
  padding: 0 24px;
  height: 34px;
  line-height: 34px;
  font-weight: normal;
  font-size: 14px;
  color: #999999;
}
.nav-item {
  display: block;
  padding: 0 24px 0 32px;
  height: 40px;
  line-height: 40px;
  font-weight: normal;
  font-size: 16px;
  color: #666666;
  border-left-width: 4px;
  border-left-style: solid;
  border-left-color: transparent;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    background-color: #f3f4f5;
  }
  &.active {
    color: #1f93ff;
    border-left-color: #1f93ff;
    background-color: #e9f4ff;
  }
}
</style>
