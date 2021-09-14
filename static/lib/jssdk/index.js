/**
 * 【使用示例】
 1. 需要使用 SDK 功能的页面路由的 meta 里配置使用指定 SDK： 
{
  xxx: xxx,
  meta: {
    jssdk: 'wework'
  }
}
 2. 代码里调用 SDK 方法前，先检查 api，再调用 api，需要外部自行考虑 api 不可用时如何处理
 async function test() {
   if (await jssdk.checkJsApi('apixxx')) {
      const sdk = await jssdk.getInstance();
      sdk.apixxx(...); // 或者： sdk.invoke('apixxx', ...);
   } else {
      // 处理 api 不可用时的场景
   }
 } 
 * 
 * 【注意】jssdk 文件需手动存放到 public 目录下，并手动在 index.html 里引入
 * 这里只负责对在路由的 meta 里配置了 jssdk 的页面，自动进行初始化 config 操作
 *
 * sdk 相关操作都是敏感、且重要的操作，因此所有节点都用 warn 和 error 来记录日志，以便上报排查
 */
import dlog from '../dlog';
import getLocalData from '../get-local-data';
import WeworkSdk from './wework-sdk';
import WechatSdk from './wechat-sdk';
import SzmcSdk from './szmc-sdk';

const TAG = '[jssdk]';

/**
 * 【szmc】 深圳地铁 JSSDK：https://smt-stg.yun.city.pingan.com/szdt/stg/open-platform/#/docs
 * 【wechat】 微信公众号 JSSDK：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
 * 【wework】 企业微信 JSSDK：https://open.work.weixin.qq.com/api/doc/90000/90136/90514
 */
const SDK = {
  szmc: new SzmcSdk(),
  wechat: new WechatSdk(),
  wework: new WeworkSdk()
};

const defaultOptions = {
  enable: () => getLocalData('sdk', 1, ['url', 'sessionstorage']), // 是否启用 sdk，可传入值，也可传入方法
  autoConfig: 1, // 当页面路由变化时，自动调用 config 设置 sdk 的初始化，关闭后需要手动调用 config
  urls: {
    config: '', // 获取 sdk 初始化的配置数据
    agentConfig: '' // 企业微信 sdk 还需要获取应用初始化的配置数据
  }
};

let curSdkInstance = null; // 当前正在使用的 sdk 实例
let lastConfigPromise = null; // 最近一次 config 的操作进度

/**
 * 初始化 sdk {@link defaultOptions}
 * @param {*} router
 * @param {*} options
 */
function init(router, options) {
  Object.assign(defaultOptions, options);
  registerAfterEach(router);
  dlog.log(TAG, '初始化 => SDK', defaultOptions);
}

// 监听路由变化
function registerAfterEach(router) {
  if (router && !!+defaultOptions.autoConfig) {
    router.afterEach((to, from) => {
      curSdkInstance = null;
      lastConfigPromise = null;
      // 需要依赖 sdk 能力的页面才进行 jssdk 的初始化
      if (to?.meta?.jssdk) {
        // sdk 启用的时候才进行初始化
        let enable = defaultOptions.enable;
        if (typeof defaultOptions.enable === 'function') {
          enable = defaultOptions.enable();
        }
        if (!!+enable) {
          config(to.meta.jssdk).catch(err => {
            console.error(TAG, err);
          });
        }
      }
    });
  }
}

/**
 * 使用的 sdk 类型 {@link SDK}
 * @param {*} type
 * @returns {*} 返回 SDK 的实例引用，可直接通过该引用调用相关 SDK 的 api 方法，具体 api 参考各自 SDK 的文档 {@link SDK}
 */
async function config(type) {
  console.warn(TAG, 'config start', type);
  if (SDK[type]) {
    lastConfigPromise = SDK[type].config(defaultOptions.urls);
    curSdkInstance = await lastConfigPromise;
  } else {
    throw new Error(`未找到 ${type} 类型的 SDK 实现`);
  }
  return curSdkInstance;
}

/**
 * 返回 SDK 的实例引用，可直接通过该引用调用相关 SDK 的 api 方法，具体 api 参考各自 SDK 的文档{@link SDK}
 * @returns
 */
async function getInstance() {
  if (!lastConfigPromise) {
    throw new Error(
      '请先在当前页面路由的 meta 里配置 jssdk，以便内部自动根据指定 sdk 类型进行初始化；或者你需要手动调用 config 来完成初始化'
    );
  }
  await lastConfigPromise;
  return curSdkInstance;
}

async function checkJsApi(api) {
  // TODO 后续再完善，先占坑
  return true;
}

export default {
  init,
  config,
  getInstance,
  checkJsApi
};
