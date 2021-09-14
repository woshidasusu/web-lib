import Vue from 'vue';
import '@/config';
import App from './doc-app.vue';
import router from './doc.router';
import store from '@/store';
import '@/assets/css/index.scss'; // 加载初始化样式文件
import '@/components'; // 自动注册所有自定义组件
import 'vant/lib/index.less'; // 引入 vant 的 less 源代码，以便可以覆盖 vant 的主题样式变量
import Vant from 'vant';
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import Loading from '@/plugins/loading';
import { copyClipboard } from './utils';

Vue.use(Vant);
Vue.use(ElementUI);
Vue.use(Loading); // 注册全局 $loading

Vue.prototype.$utils = {
  copyClipboard
};

window.__store = store;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
