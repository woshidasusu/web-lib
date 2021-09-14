import BaseSdk from './base-sdk';
import http from '../http';
const TAG = '[WeworkSdk]';
export default class WeworkSdk extends BaseSdk {
  config(urls) {
    const argsToString = this.argsToString;
    // 企业微信 SDK 使用全局变量 wx 来访问
    const wx = window.wx;
    if (!wx) {
      console.error(TAG, 'WXJSSDK init error, carsu window.wx is null');
      return;
    }
    let configResolve = null;
    let configReject = null;
    const jsApiList = this.getJsApiList();
    const configPromise = new Promise(async (resolve, reject) => {
      configResolve = resolve;
      configReject = reject;
      const url = location.href;
      const res = await http.get(urls.config, { url });
      console.warn(TAG, 'get wx config finish', res);
      if (res?.errcode === 0) {
        const data = res?.data;
        wx.config({
          beta: true, // 必须这么写，否则 wx.invoke 调用形式的jsapi会有问题
          jsApiList: jsApiList, // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
          ...data,
          debug: data?.debug || window.__debug_sdk__ // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        });
      } else {
        reject(new Error(res?.errmsg || '获取微信配置信息失败'));
      }
    });

    wx.ready(async function() {
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      console.warn(TAG, 'wx.ready(), then start get agent config');
      const url = location.href;
      const res = await http.get(urls.agentConfig, { url });
      console.warn(TAG, 'get agent config finish', res);
      if (res?.errcode === 0) {
        const data = res?.data;
        wx.agentConfig({
          jsApiList: jsApiList, // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
          ...data,
          debug: data?.debug || window.__debug_sdk__, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          success: function(res) {
            console.warn(TAG, 'wx.agentConfig() success');
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
          },
          fail: function(res) {
            console.error(TAG, 'wx.agentConfig() error', res);
            configReject(res);
          }
        });
      } else {
        reject(new Error(res?.errmsg || '获取微信配置信息失败'));
      }
    });
    wx.error(function(res) {
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      console.error(TAG, 'wx.config() error', res);
      configReject(res);
    });

    return configPromise;
  }

  getJsApiList() {
    // https://open.work.weixin.qq.com/api/doc/90000/90136/90507
    return [
      'selectEnterpriseContact',
      'openUserProfile',
      'selectExternalContact',
      'getCurExternalContact',
      'getCurExternalChat',
      'sendChatMessage',
      'getContext',
      'openEnterpriseChat',
      'onMenuShareAppMessage',
      'onMenuShareWechat',
      'onMenuShareTimeline',
      'shareAppMessage',
      'shareWechatMessage',
      'shareToExternalContact',
      'shareToExternalChat',
      'onHistoryBack',
      'hideOptionMenu',
      'showOptionMenu',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'closeWindow',
      'openDefaultBrowser',
      'onUserCaptureScreen',
      'scanQRCode',
      'chooseInvoice',
      'enterpriseVerify',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'getLocalImgData',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'pauseVoice',
      'stopVoice',
      'onVoicePlayEnd',
      'uploadVoice',
      'downloadVoice',
      'translateVoice',
      'previewFile',
      'startWifi',
      'stopWifi',
      'connectWifi',
      'getWifiList',
      'onGetWifiList',
      'onWifiConnected',
      'getConnectedWifi',
      'openBluetoothAdapter',
      'closeBluetoothAdapter',
      'getBluetoothAdapterState',
      'onBluetoothAdapterStateChange',
      'startBluetoothDevicesDiscovery',
      'stopBluetoothDevicesDiscovery',
      'getBluetoothDevices',
      'onBluetoothDeviceFound',
      'getConnectedBluetoothDevices',
      'createBLEConnection',
      'closeBLEConnection',
      'onBLEConnectionStateChange',
      'getBLEDeviceServices',
      'getBLEDeviceCharacteristics',
      'readBLECharacteristicValue',
      'writeBLECharacteristicValue',
      'notifyBLECharacteristicValueChange',
      'onBLECharacteristicValueChange',
      'startBeaconDiscovery',
      'stopBeaconDiscovery',
      'getBeacons',
      'onBeaconUpdate',
      'onBeaconServiceChange',
      'setClipboardData',
      'getNetworkType',
      'onNetworkStatusChange',
      'openLocation',
      'getLocation',
      'startAutoLBS',
      'stopAutoLBS',
      'onLocationChange',
      'hideChatAttachmentMenu',
      'selectCorpGroupContact'
    ];
  }
}
