<template>
  <div class="layout-container">
    <div class="title">页面配置化平台</div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="项目里配置化的页面列表" name="project"></el-tab-pane>
      <el-tab-pane label="自定义配置化列表" name="customer"></el-tab-pane>
    </el-tabs>
    <div style="display: flex">
      <yl-search-bar :model="searchParams" width="220px" class="search-wrapper" :label-show-length="0" show-clear>
        <yl-search-item prop="codeName" label="code/name/模块">
          <el-input
            v-model="searchParams.codeName"
            label="name"
            value="id"
            placeholder="code/name/模块"
            size="medium"
          />
        </yl-search-item>
      </yl-search-bar>
      <yl-space style="margin-left: auto;align-self: center;">
        <el-button v-if="activeTab === 'customer'" type="primary" @click="goEdit(null, 'formPage')"
          >新增表单页</el-button
        >
        <el-button v-if="activeTab === 'customer'" type="primary" @click="goEdit(null, 'listPage')"
          >新增列表页</el-button
        >
      </yl-space>
    </div>
    <m-table v-loading="loading" :data="tableData" :page-size="99999" :default-columns="['index']">
      <el-table-column width="150px" label="code" prop="code"></el-table-column>
      <el-table-column width="150px" label="模块" prop="module"></el-table-column>
      <el-table-column width="150px" label="name" prop="name"></el-table-column>
      <el-table-column label="页面的代码路径" prop="codePath"></el-table-column>
      <el-table-column label="本地元数据路径" prop="metadataPath"></el-table-column>
      <el-table-column width="300px" label="操作">
        <template slot-scope="scope">
          <yl-space :size="[8, 16]" wrap>
            <a @click="goDetail(scope.row, 'local')">查看本地元数据</a>
            <a @click="goPreview(scope.row, 'local')">预览本地</a>
            <a v-if="scope.row.standard" @click="goDetail(scope.row, 'remote')">查看服务器元数据</a>
            <a v-if="scope.row.standard" @click="goPreview(scope.row, 'remote')">预览服务器</a>
            <a @click="goEdit(scope.row, scope.row.type)">编辑</a>
          </yl-space>
        </template>
      </el-table-column>
    </m-table>
  </div>
</template>

<script>
import { MTable } from '@/components/mui';
import metadataList from '../config/metadata-list';
import { fetchFormMetadata } from '../../core/request';
export default {
  components: {
    MTable
  },
  props: {},
  data() {
    return {
      activeTab: 'project',
      searchParams: {
        codeName: ''
      },
      loading: false,
      projectMetadataList: [],
      customerMetadataList: []
    };
  },
  computed: {
    tableData() {
      let data = this.projectMetadataList;
      if (this.activeTab === 'customer') {
        data = this.customerMetadataList;
      }
      data = data.filter(v => {
        if (this.searchParams.codeName) {
          return (
            v.code?.indexOf(this.searchParams.codeName) > -1 ||
            v.name?.indexOf(this.searchParams.codeName) > -1 ||
            v.module?.indexOf(this.searchParams.codeName) > -1
          );
        }
        return true;
      });
      return data;
    }
  },
  watch: {
    activeTab: {
      handler: function(newV) {
        if (newV === 'project') {
          this.getProjectMetadataList();
        } else if (newV === 'customer') {
          this.getCustomerMetadataList();
        }
      },
      immediate: true
    }
  },
  async mounted() {},
  destroyed() {},
  methods: {
    async getProjectMetadataList() {
      this.loading = true;
      const res = await Promise.all(metadataList.filter(v => v.code).map(v => fetchFormMetadata({ code: v.code })));
      this.loading = false;
      const metadataInfoCache = {};
      res?.forEach(v => {
        if (v.errcode === 0 && v.data) {
          metadataInfoCache[v.data.view_code] = v.data;
        }
      });
      this.projectMetadataList = metadataList.map(v => {
        return {
          ...v,
          ...metadataInfoCache[v.code]
        };
      });
    },
    async getCustomerMetadataList() {},
    goDetail(item, type) {
      localStorage.setItem('__metadata', JSON.stringify(item));
      this.$router.push({ path: 'detail', query: { type: type } });
    },
    goPreview(item, type) {
      localStorage.setItem('__metadata', JSON.stringify(item));
      this.$router.push({ path: 'preview', query: { type: type } });
    },
    goEdit(item, type) {
      if (item) {
        localStorage.setItem('__metadata', JSON.stringify(item));
      } else {
        localStorage.removeItem('__metadata');
      }
      this.$router.push({ path: 'edit', query: { type: type } });
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-container {
  padding: 20px 40px;

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
  }
}
</style>
