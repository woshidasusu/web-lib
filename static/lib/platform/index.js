/**
 * 浏览器信息
 */
let navigator = window.navigator;
let _ua = navigator.userAgent;
let _device = window.device || {};

/**
 * 是否是iOS设备
 *
 * @returns {boolean}
 */
let isIOS = () => {
  if (_device.platform) {
    return _device.platform.toLowerCase() === 'ios';
  }

  return /iPhone|iPad|iPod/.test(_ua);
};

/**
 * 是否是Android设备
 *
 * @returns
 */
let isAndroid = () => {
  if (_device.platform) {
    return _device.platform.toLowerCase() === 'android';
  }

  return _ua.indexOf('Android') > -1;
};

/**
 * 是否是Ipad
 *
 * @returns
 */
let isIPad = () => {
  if (/iPad/i.test(_navigator.platform)) {
    return true;
  }

  return /iPad/i.test(_ua);
};
const isIOSX = () => {
  return isIOS() && screen.height === 812 && screen.width === 375;
};
/**
 * 是否是app
 *
 * @returns
 */
let isApp = () => {
  return isAndroid() || isIOS();
};

export default {
  isIOSX: isIOSX,
  isIOS: isIOS,
  isAndroid: isAndroid,
  isIPad: isIPad
};

export { isIOS, isAndroid, isIPad, isApp, isIOSX };
