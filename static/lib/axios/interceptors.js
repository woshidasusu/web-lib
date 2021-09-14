import dlog from '../dlog';
import redirectPage from './redirect-page';
import getAutoParams from './get-auto-params';
import qs from 'qs';

// 检查登录状态跳转登录
function checkRedirectStatus(config, res = {}) {
  if (config?.redirect && res?.errcode === config?.redirect && res?.data?.url) {
    console.warn('[axios] 正在进行重定向', res, res.data.url);
    redirectPage(res.data.url);
    return new Promise(() => {});
  }
  return true;
}

// 数据字段映射
function transformData(fieldConfig, data) {
  if (fieldConfig || !data) {
    if (typeof fieldConfig === 'function') {
      return fieldConfig(data);
    } else {
      return {
        ...data,
        errcode: data[fieldConfig.errcode || 'errcode'],
        errmsg: data[fieldConfig.errmsg || 'errmsg'],
        data: data[fieldConfig.data || 'data']
      };
    }
  }
  return data;
}

export function requestInterceptor(config) {
  if (!config || !config.url) {
    return config;
  }
  if (!config.disableAutoParams) {
    const autoParams = getAutoParams(config.url);
    if (Object.keys(autoParams).length) {
      config.url = `${config.url}${config.url.indexOf('?') > -1 ? '&' : '?'}${qs.stringify(autoParams)}`;
    }
  }

  return config;
}

export async function responseInterceptor(response) {
  if (!response) {
    console.error('[axios]/response', 'response is empty');
    return response;
  }
  const url = response.config && response.config.url;
  dlog.log('[axios]/response', url, response.status);
  if (response.status >= 200 && response.status < 300) {
    // 200 的状态码，先校验登录态，再直接返回 data 数据给上层
    response.data = transformData(response.config?.responseFieldConfig, response.data);
    await checkRedirectStatus(response.config?.errcodeConfig, response.data);
    return response.data;
  }
  return response;
}

// 统一错误处理
export function handleError(error) {
  console.error('[axios]', error);
  return Promise.reject(error);
}
