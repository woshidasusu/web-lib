// import getO from '@../get-local-data/get-o';
import getToken from '../get-local-data/get-token';

/**
 * 自动补充请求参数，配置格式 {key: 'xxx', value: 'xxx'}
 * 其中，value 支持配置固定值、方法引用
 * 如果 value 是方法类型，则会调用方法获取返回值来使用
 */
const autoParams = [
  // {
  //   key: 'o',
  //   value: getO
  // },
  {
    key: 'token',
    value: getToken
  }
];

/**
 * 获取默认填充的参数
 * @param {String} url 如果 url 有值，则会先判断 url 上没有携带自动填充的参数时，才会去把参数补上；否则，直接返回需要自动填充的参数对象
 */
function getAutoParams(url, extraAutoParams = []) {
  const result = {};
  [...autoParams, ...extraAutoParams].forEach((v, i) => {
    // 当请求没有携带必填参数时
    if (!url || !url.match(new RegExp(`[?|&]${v.key}=`))) {
      let value = v.value;
      if (typeof v.value === 'function') {
        value = v.value();
      }
      result[v.key] = value;
    }
  });
  return result;
}

export default getAutoParams;
