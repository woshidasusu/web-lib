import axios from 'axios';
import dlog from '../dlog';
import domain from './domain';
import getO from '../get-local-data/get-o';
import { requestInterceptor, responseInterceptor, handleError } from './interceptors';
import getAutoParams from './get-auto-params';
import qs from 'qs';

/**
 * 全局的请求配置
 * 示例
   responseFieldConfig: res => {
     return {
       errcode: res.status ? 0 : 1,
       errmsg: res.message,
       data: res.data
     };
   } 
   或者：
   responseFieldConfig: {
     errcode: 'status',
     errmsg: 'message',
     data: 'data'
   }
 */
const defaultOptions = {
  errcodeConfig: {
    redirect: '' // 接口请求校验不通过，需要进行重定向时的错误码（errcode，需要跟后端协定）
  },
  disableAutoParams: false, // 默认会拦截所有请求并进行自动参数填充处理，如果不需要，可以设置为 true，支持针对某个请求设置
  responseFieldConfig: null // 接口返回的数据字段映射，默认配置 errcode 那一套
};
const axiosInstance = axios.create(defaultOptions);

// 拦截请求
axiosInstance.interceptors.request.use(requestInterceptor, handleError);
axiosInstance.interceptors.response.use(responseInterceptor, handleError);

/**
 * 初始化请求配置
 *
 * @param {*} options 给当前请求设置的配置，参考 axios 配置，在 axios 的配置基础上
 * 增加 autoParams 自动参数填充配置，具体参考 {@link getAutoParams}
 * 增加 responseFieldConfig 返回数据的字段映射配置 {@link defaultOptions}
 */
async function init(options = { autoParams: [], responseFieldConfig: null }) {
  await domain.init();
  Object.assign(defaultOptions, options);
  dlog.log('[axios]', '初始化 => axios 配置', options);
}

/**
 * 更新请求的默认配置
 * @param {*} options
 */
function update(options) {
  Object.assign(defaultOptions, options);
  dlog.log('[axios]', '更新 axios 配置', options);
}

/**
 *
 * @param {String} url 接口地址（没有域名部分）
 * @param {Object} params 参数
 * @param {Object} options 配置
 * @returns promise 类型数据
 */
export async function get(url, params, options) {
  url = await path(url, {}, options);
  const _options = {
    ...defaultOptions,
    ...options,
    params: params
  };

  delete _options.autoParams;
  return axiosInstance.get(url, _options);
}

/**
 * post 请求，参数类型默认 application/json 格式
 * @param {String} url 接口地址（没有域名部分）
 * @param {Object} params 参数
 * @param {Object} options 配置
 * @returns promise 类型数据
 */
export async function post(url, params, options) {
  url = await path(url, {}, options);
  const _options = {
    ...defaultOptions,
    ...options
  };
  delete _options.autoParams;
  return axiosInstance.post(url, params, _options);
}

/**
 * 生成接口请求的地址
 *
 * 生成规则：获取域名（根据域名机制）、拼接租户 code、拼接 params 参数、拼接自动填充参数（根据 autoParams 配置）
 *
 * @param {String} url 接口地址（没有域名部分）
 * @param {Object} params 参数
 * @param {Object} options 配置
 * @returns promise 类型数据
 */
export async function path(url, params, options) {
  // 已经是完整的 url 地址的就不需要再经过 url 地址生成处理了
  if (url.startsWith('http')) {
    return url;
  }
  url = url.replace(/^\//, '');
  const tenantCode = getO() || '';
  let domainUrl = await domain.getDomain();
  domainUrl = domainUrl?.replace(/\/$/, '');
  const _options = {
    ...defaultOptions,
    ...options
  };
  const _params = {
    ...(_options?.disableAutoParams || getAutoParams(url, _options?.autoParams)),
    ...params
  };
  let result = `${domainUrl || ''}/${tenantCode}/${url}`;
  if (Object.keys(_params).length) {
    result += `${url.indexOf('?') > -1 ? '&' : '?'}${qs.stringify(_params)}`;
  }
  return result;
}

export default {
  init,
  update,
  get,
  post,
  path
};
