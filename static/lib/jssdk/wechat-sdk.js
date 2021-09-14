import BaseSdk from './base-sdk';
const TAG = '[WechatSdk]';
export default class WechatSdk extends BaseSdk {
  config(urls) {
    const argsToString = this.argsToString;
    // 微信 SDK 使用全局变量 wx 来访问
    const wx = window.wx;
    if (!wx) {
      console.error(TAG, 'WXJSSDK init error, carsu window.wx is null');
      return;
    }
    let configResolve = null;
    let configReject = null;
    const configPromise = new Promise(async (resolve, reject) => {
      configResolve = resolve;
      configReject = reject;
      const url = location.href;
      const res = await http.get(urls.config, { url });
      console.warn(TAG, 'get wx config finish', res);
      if (res?.errcode === 0) {
        const data = res?.data;
        wx.config({
          jsApiList: this.getJsApiList(), // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
          ...data,
          debug: data?.debug || window.__debug_sdk__ // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        });
      } else {
        reject(new Error(res?.errmsg || '获取微信配置信息失败'));
      }
    });

    wx.ready(function() {
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      console.warn(TAG, 'wx.config() success');
      // 代理 wx 对象，记录 api 调用日志
      configResolve(
        new Proxy(wx, {
          get(target, key, receiver) {
            if (typeof target[key] === 'function') {
              return (...args) => {
                try {
                  console.warn(TAG, `wx.${key}(${argsToString(args)})`);
                } catch (error) {
                  console.error(TAG, error);
                }
                return Reflect.get(target, key, receiver)(...args);
              };
            }
            return Reflect.get(target, key, receiver);
          }
        })
      );
    });
    wx.error(function(res) {
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      console.error(TAG, 'wx.config() error', res);
      configReject(res);
    });

    return configPromise;
  }

  getJsApiList() {
    // https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#63
    return [
      'updateAppMessageShareData',
      'updateTimelineShareData',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'pauseVoice',
      'stopVoice',
      'onVoicePlayEnd',
      'uploadVoice',
      'downloadVoice',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'translateVoice',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay',
      'openProductSpecificView',
      'addCard',
      'chooseCard',
      'openCard'
    ];
  }
}
