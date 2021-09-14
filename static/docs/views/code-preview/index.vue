<template>
  <div class="preview-block">
    <div class="operate-container">
      <el-button type="text" icon="el-icon-video-play" @click="handleRun">
        运行
      </el-button>
      <el-button type="text" icon="el-icon-refresh" @click="handleReset">
        重置
      </el-button>
    </div>
    <div class="preview-panel">
      <div class="preview-source" @keydown.ctrl.s="onCtrlSClick">
        <codemirror v-model="codeSource" :options="cmOptions" />
      </div>
      <div class="preview-code">
        <div id="previewApp"></div>
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
import 'codemirror/mode/vue/vue.js'; // 代码风格
// import 'codemirror/addon/edit/closebrackets';
// import 'codemirror/addon/edit/matchbrackets';

import { local } from '../../utils/storage';
import { scopedCss, stripTemplate, stripScript, stripStyle } from '../../utils';

const version = 'unkonwn';

// 基础例子
const defaultCode = `<template>
  <div>
    <el-alert type="success" :closable="false">
      欢迎使用 kfui 当前版本为 ${version}
    </el-alert>
  </div>
</template>
<script>
export default {

};
\<\/script>
<style>
</style>`;

export default {
  name: 'CodePreview',
  components: {
    codemirror
  },
  data() {
    return {
      codeSource: '',
      source: '',
      cmOptions: {
        tabSize: 2,
        theme: 'monokai',
        mode: 'text/x-vue',
        // indentWithTabs: true,
        // smartIndent: true,
        styleActiveLine: true,
        lineNumbers: true,
        // matchBrackets: true, //括号匹配
        autoCloseBrackets: true
      }
    };
  },
  watch: {
    source(nv = defaultCode) {
      const html = stripTemplate(nv);
      const script = stripScript(nv);
      const style = stripStyle(nv);
      this.renderCode({ script, html });
      this.insertCss({ style });
    }
  },
  mounted() {
    const source = local.get('kf-preview-source');
    this.source = source;
    this.codeSource = source;
  },
  methods: {
    onCtrlSClick(event) {
      event.preventDefault();
      this.handleRun();
    },
    renderCode({ script, html }) {
      const js = script.replace(/export default/, 'return ');
      const renderComponent = new Function(js)();
      renderComponent.template = `<div id="previewApp">${html}</div>`;
      const instance = Vue.extend(renderComponent);
      new instance().$mount('#previewApp');
    },
    insertCss({ style }) {
      let css = document.querySelector('#preview-style');
      if (!css) {
        css = document.createElement('style');
        css.setAttribute('id', 'preview-style');
        css.setAttribute('type', 'text/css');
      }
      css.innerHTML = scopedCss(style, 'preview-code');
      document.head.appendChild(css);
    },
    handleRun() {
      this.source = this.codeSource;
    },
    handleReset() {
      this.$confirm('您当前的代码尚未保存，确认要重置吗？', '重置确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.source = defaultCode;
          this.codeSource = defaultCode;
          local.set('kf-preview-source', defaultCode);
        })
        .catch(() => {});
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
  text-align: right;
  padding-right: 40px;
  border-bottom: solid 1px #ebebeb;
}
.preview-header {
  display: flex;
  align-items: center;
  height: 60px;
}
.preview-panel {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.preview-source {
  display: block;
  width: 50%;
  background-color: #f3f4f5;
  overflow: auto;
}
.preview-code {
  display: block;
  width: 50%;
  padding: 24px;
  overflow: auto;
}
/deep/ .CodeMirror.cm-s-monokai {
  height: 100%;
}
</style>
