import './public-path';
import Vue from 'vue';
import App from './App';
import router from '@/router';

const TAG = '[wework-app]';

let instance = null;

function init(props = {}) {
  const { container } = props;
  /* eslint-disable no-new */
  instance = new Vue({
    router,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app');
}

if (!window.__POWERED_BY_QIANKUN__) {
  // 非微前端场景下，直接渲染
  console.warn(TAG, 'no micro app, render');
  init();
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.warn(TAG, 'bootstrap');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.warn(TAG, 'mount', props);
  init(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  console.warn(TAG, 'unmount', props);
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  window.__store = null;
}
