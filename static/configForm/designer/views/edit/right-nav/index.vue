<template>
  <div class="right-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基础配置">
        <el-form v-model="metadata">
          <el-form-item label="页面类型" prop="type">
            <el-select v-model="metadata.type" disabled style="width: 100%" placeholder="页面类型">
              <el-option label="表单页" value="formPage"></el-option>
              <el-option label="列表页" value="listPage"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签宽度(带单位)" prop="labelWidth">
            <el-input v-model="metadata.labelWidth" placeholder="标签宽度"></el-input>
          </el-form-item>
          <el-form-item label="数据仓库"> </el-form-item>
          <el-form-item label="数据源"> </el-form-item>
          <el-form-item label="表单回填配置"> </el-form-item>
          <el-form-item label="底部按钮配置"> </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="curEditComponent" label="组件配置">
        <el-form v-model="curEditComponent">
          <el-form-item label="_id" style="margin-bottom: 0">
            <span>{{ curEditComponent._id }}</span>
          </el-form-item>
          <el-form-item label="type" style="margin-bottom: 0">
            <span>{{ curEditComponent.type }}</span>
          </el-form-item>
          <el-form-item v-if="curEditComponent.label != null" label="标签">
            <el-input v-model="curEditComponent.label" placeholder="label"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.label != null" label="标签宽度">
            <el-input v-model="curEditComponent.labelWidth" placeholder="默认以基础配置里的标签宽度为主"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.width != null" label="宽度">
            <el-input v-model="curEditComponent.width" placeholder="默认 100%"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.placeholder != null" label="placeholder">
            <el-input v-model="curEditComponent.placeholder" placeholder="默认取 label 字段自动拼接"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.showValue != null" label="小标题">
            <el-input v-model="curEditComponent.showValue" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.name != null" label="绑定表单字段">
            <el-input v-model="curEditComponent.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.value != null" label="绑定表单字段的初始值">
            <el-input
              v-if="typeof curEditComponent.value === 'string'"
              v-model="curEditComponent.value"
              placeholder=""
            ></el-input>
            <div>
              <br />
              <div style="white-space: pre-wrap;line-height: 20px;" v-html="curEditComponent.value"></div>
            </div>
          </el-form-item>
          <el-form-item v-if="curEditComponent.tip != null" label="设置说明文案">
            <el-input v-model="curEditComponent.tip" placeholder="设置说明文案"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.required != null" label="是否必填">
            <el-switch v-model="curEditComponent.required" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.hidden != null" label="是否隐藏">
            <el-switch v-model="curEditComponent.hidden" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.disabled != null" label="是否禁用">
            <el-switch v-model="curEditComponent.disabled" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.cancelConfirm != null" label="取消勾选时是否二次弹窗确认">
            <el-switch v-model="curEditComponent.cancelConfirm" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.doubleConfirm != null" label="是否需要二次弹窗确认操作">
            <el-switch v-model="curEditComponent.doubleConfirm" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.multiple != null" label="是否多选">
            <el-switch v-model="curEditComponent.multiple" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.clearable != null" label="是否支持清空">
            <el-switch v-model="curEditComponent.clearable" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.showWordLimit != null" label="是否显示字数限制">
            <el-switch v-model="curEditComponent.showWordLimit" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.showRegion != null" label="是否显示县区级数据">
            <el-switch v-model="curEditComponent.showRegion" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item v-if="curEditComponent.showWordLimit" label="限多少字">
            <el-input v-model="curEditComponent.maxlength" placeholder="限多少字"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.rows != null" label="行数">
            <el-input-number v-model="curEditComponent.rows"></el-input-number>
          </el-form-item>
          <el-form-item v-if="curEditComponent.type === 'inputNumber'" label="min">
            <el-input-number v-model="curEditComponent.min"></el-input-number>
          </el-form-item>
          <el-form-item v-if="curEditComponent.type === 'inputNumber'" label="max">
            <el-input-number v-model="curEditComponent.max"></el-input-number>
          </el-form-item>
          <el-form-item v-if="curEditComponent.format != null" label="日期显示格式化(format)">
            <el-input v-model="curEditComponent.format" placeholder="默认 yyyy-MM-dd HH:mm"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.valueFormat != null" label="日期值格式化(valueFormat)">
            <el-input v-model="curEditComponent.valueFormat" placeholder="默认 yyyy-MM-dd HH:mm"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.prefixIcon != null" label="左图标">
            <el-input v-model="curEditComponent.prefixIcon" placeholder="默认 el-icon-date"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.addText != null" label="添加按钮的文案">
            <el-input v-model="curEditComponent.addText" placeholder="默认根据 label 字段自动拼接"></el-input>
          </el-form-item>
          <el-form-item v-if="curEditComponent.addTip != null" label="说明文案">
            <el-input v-model="curEditComponent.addTip" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="数据源"> </el-form-item>
          <el-form-item label="初始化"> </el-form-item>
          <el-form-item label="监听事件"> </el-form-item>
          <el-form-item label="表单校验"> </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dynamicStore from '@/store/dynamicStore';
export default {
  components: {},
  props: {},
  data() {
    return {
      activeTab: '0'
    };
  },
  computed: {
    ...dynamicStore.cfDesignerEdit.statesToComputed(['edit.metadata', 'edit.curEditComponent'])
  },
  watch: {
    curEditComponent(newV) {
      if (newV) {
        this.activeTab = '1';
      } else {
        this.activeTab = '0';
      }
    }
  },
  created() {},
  async mounted() {},
  destroyed() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.right-container {
  position: fixed;
  top: 75px;
  right: 20px;
  width: 330px;
  bottom: 20px;
  padding: 20px;
  box-shadow: 0 2px 13px 0 #ebeef5;
  overflow: auto;

  /deep/ .el-form-item {
    margin-bottom: 8px;
  }
}
.group-container {
  border-top: 1px solid #ebeef5;
  padding: 15px 0;
  font-size: 15px;
  font-weight: bold;
  color: #333333;
}
</style>
