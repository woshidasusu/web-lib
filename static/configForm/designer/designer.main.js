import Vue from 'vue';
import App from './designer-app.vue';
import router from './designer-router';
import store from '@/store';

import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import UI from '@/components';
import '@/assets/css/layout.css';
import '@/assets/css/elementReset.scss';
import '@/assets/css/index.scss';
import '@/assets/iconfont/iconfont.css';
import '@/assets/iconfont/iconfont.js';
import pluinAjax from '@/plugins/Axios';
import pluginTips from '@/plugins/Tips';
import ylui from '@yl/ui';
import '@yl/ui/lib/theme-chalk/index.css';

Vue.use(ElementUI, { size: 'medium' });
Vue.use(UI);
Vue.use(pluinAjax);
Vue.use(pluginTips);
Vue.use(ylui);

window.__store = store;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
