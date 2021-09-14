<template>
  <div class="preview-block">
    <div class="operate-container">
      <el-button type="text">
        <a href="https://confluence.mysre.cn/pages/viewpage.action?pageId=41394809" target="blank">
          打开元数据配置文档
        </a>
      </el-button>
      <el-button type="text" @click="hideEditArea = !hideEditArea">
        {{ hideEditArea ? '显示' : '隐藏' }}编辑区
      </el-button>
      <el-button type="text">
        <router-link to="/docs">
          返回文档首页
        </router-link>
      </el-button>
      <el-button style="margin-left: auto" type="text" icon="el-icon-video-play" @click="handleRun">
        运行
      </el-button>
    </div>
    <div class="preview-panel">
      <div v-if="!hideEditArea" class="preview-source" @keydown.ctrl.s="onCtrlSClick">
        <codemirror v-model="codeSource" :options="cmOptions" />
      </div>
      <div class="preview-code">
        <config-form v-if="!loading" ref="configFormRef" :metadata="source">
          <div class="footer-btns">
            <el-button size="medium" @click="$refs.configFormRef.validate()">
              触发校验
            </el-button>
            <el-button size="medium" @click="$refs.configFormRef.clearValidate()">
              移除校验
            </el-button>
          </div>
        </config-form>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css'; // 核心样式
import 'codemirror/theme/monokai.css'; //编辑器主题样式，配置里面theme需要设置monokai
import 'codemirror/mode/javascript/javascript'; // 这js模式必须引入的
import 'codemirror/mode/css/css';
import 'codemirror/addon/selection/active-line'; //光标行背景高亮，配置里面也需要styleActiveLine设置为true
import 'codemirror/keymap/sublime'; //sublime编辑器效果
// import 'codemirror/mode/vue/vue.js'; // 代码风格
// import 'codemirror/addon/edit/closebrackets';
// import 'codemirror/addon/edit/matchbrackets';

import initData from './initdata';
import configForm from '@/components/config-form';

export default {
  name: 'CodePreview',
  components: {
    codemirror,
    configForm
  },
  data() {
    return {
      loading: false,
      hideEditArea: false,
      codeSource: '',
      source: {},
      cmOptions: {
        tabSize: 2,
        theme: 'monokai',
        mode: 'javascript',
        // indentWithTabs: true,
        // smartIndent: true,
        styleActiveLine: true,
        lineNumbers: true,
        // matchBrackets: true, //括号匹配
        autoCloseBrackets: true
      }
    };
  },
  watch: {},
  mounted() {
    this.source = initData;
    this.codeSource = JSON.stringify(initData, ' ', 2);
  },
  methods: {
    onCtrlSClick(event) {
      event.preventDefault();
      this.handleRun();
    },
    handleRun() {
      this.loading = true;
      this.source = JSON.parse(this.codeSource);
      setTimeout(() => {
        this.loading = false;
      }, 16);
    }
  }
};
</script>

<style lang="scss" scoped>
.preview-block {
  background: #fff;
  display: flex;
  flex-direction: column;
  border: solid 1px #ebebeb;
  border-radius: 3px;
  transition: 0.3s;
  height: 100vh;
  overflow: hidden;
}
.operate-container {
  display: flex;
  align-content: center;
  padding: 0 40px;
  border-bottom: solid 1px #ebebeb;
}
.preview-panel {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.preview-source {
  display: block;
  width: 40%;
  background-color: #f3f4f5;
  flex-shrink: 0;
  overflow: auto;
}
.preview-code {
  display: block;
  width: 60%;
  padding: 24px;
  flex-grow: 1;
  overflow: auto;
}
/deep/ .CodeMirror.cm-s-monokai {
  height: 100%;
}
</style>
