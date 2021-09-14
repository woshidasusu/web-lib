import getQuery from './get-query';
import getCookie from './get-cookie';
import localstorage from '../localstorage';
import dlog from '../dlog';

// 默认分别依次从以下地方取数： url, localstorage
let source = ['url', 'localstorage'];
let getDataFn = {
  url: getQuery,
  cookie: getCookie,
  localstorage: key => localstorage.getString(key),
  sessionstorage: key => sessionStorage.getItem(key)
};

/**
 * 默认分别依次从以下地方 {@link source} 取值，获取到则返回，否则返回默认值
 * 支持指定单次取值的来源
 *
 * @param {*} key
 * @param {*} defaultValue
 * @param {*} _source
 */
function getLocalData(key, defaultValue = '', _source) {
  let result = null;
  (_source || source).find(v => {
    result = getDataFn[v](key);
    return result;
  });
  if (result != null) {
    return result;
  }
  return defaultValue;
}

/**
 * 初始化本地取数逻辑，默认会分别依次从以下地方取数： url, localstorage
 * 可以通过配置 source 来更新优先级
 * 也可以通过配置 getDataFn 来扩展其他取数来源和逻辑
 * @param {*} options
 */
export function localDataInit(options = { source: ['url', 'localstorage'], getDataFn: {} }) {
  source = options?.source || source;
  Object.assign(getDataFn, options?.getDataFn);
  dlog.log('[get-local-data]', '初始化 => getLocalData', options);
}
export default getLocalData;
