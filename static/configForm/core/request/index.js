import { axiosCommon } from '@/config';

/**
 * 发起请求
 * @param {methos = 'get', url, params, dataKey = 'data'}
 * @returns
 */
export default async function request({ method = 'get', url, params, dataKey = 'data' }) {
  let res = {};
  try {
    if (method === 'post') {
      res = await axiosCommon.$POST(url, params);
    } else {
      res = await axiosCommon.$GET(url, params);
    }
  } catch (error) {
    console.error(error);
  }
  if (res.errcode === 0) {
    const dataKeys = dataKey.split('.');
    let result = res;
    while (dataKeys.length > 0) {
      if (result == null) {
        console.error('[request]', dataKey + ' 读取异常，请检查数据结构');
        break;
      }
      const key = dataKeys.shift();
      result = result[key];
    }
    return result;
  }
  return '';
}

// 获取配置化表单的元数据
// code 必填 string 模板code
// version 选填 string 版本（不填时默认拉取最新）
export function fetchFormMetadata(params) {
  return axiosCommon.$GET('common-api/template/get-template', params);
}

// post 提交
export function submit(url, params) {
  const headers = { 'Content-Type': 'application/json;charset=UTF-8' };
  return axiosCommon.$POST(url, params, { headers });
}
