import WebUpload from '@yl/web-upload';
import dlog from '../dlog';
import getO from '../get-local-data/get-o';
import uuid from '../uuid';
import { getSuffix } from '../file-tool';
import http from '../http';

const TAG = '[web-upload]';

const defaultOptions = {
  stsConfigUrl: ''
};

let lastFetchStsConfigTime = 0;
let lastStsConfig = null;

function init(options) {
  Object.assign(defaultOptions, options);
  dlog.log(TAG, '初始化 => 前端直传', defaultOptions);
}

async function fetchStsConfig() {
  const now = new Date().getTime();
  if (lastStsConfig && now - lastFetchStsConfigTime < 5000) {
    //  5s 内的上传，直接复用之前的配置
    return lastStsConfig;
  } else {
    lastStsConfig = null;
  }
  const res = await http.get(defaultOptions.stsConfigUrl);
  // const res = {
  //   errcode: 0,
  //   data: {
  //     status: 200,
  //     Type: 'minio',
  //     AccessKeyId: 'F3V2OLI2GPTHZZ9NCG54',
  //     AccessKeySecret: 'MGCC+GsOZPg6BMOvPRAqavTRxyrNJsGdvuaCcX+H',
  //     Expiration: '1627388021',
  //     SecurityToken:
  //       'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJGM1YyT0xJMkdQVEhaWjlOQ0c1NCIsImV4cCI6OTAwMDAwMDAwMDAwLCJwb2xpY3kiOiJyZWFkd3JpdGUiLCJzZXNzaW9uUG9saWN5IjoiZXdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDSldaWEp6YVc5dUlqb2dJakl3TVRJdE1UQXRNVGNpTENBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJbE4wWVhSbGJXVnVkQ0k2SUZzS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSHNLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJa0ZqZEdsdmJpSTZJRnNpY3pNNktpSmRMQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWlSV1ptWldOMElqb2dJa0ZzYkc5M0lpd0tJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lsSmxjMjkxY21ObElqb2dXeUpoY200NllYZHpPbk16T2pvNktpSmRDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUNpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdYUW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5In0.2qmJsTPNAViEwhLq6hGCbprCAjREMzUyxphq2fJFpJfJhY_RYkJ7EYtHDIVrVlO46cgh2h6R-8m3I5jMV01xbw',
  //     Bucket: 'kefu',
  //     Endpoint: 'https://minio-test.mysre.cn',
  //     Region: '',
  //     CustomDomain: 'https://minio-test.mysre.cn/kefu'
  //   }
  // };
  if (res?.errcode === 0) {
    lastFetchStsConfigTime = now;
    lastStsConfig = res.data;
    return res.data;
  }
}

/**
 * 获取文件上传的路径
 * @param {*} tenantCode 租户，foler：文件夹，fileName：文件名
 * @returns
 */
export function getUploadFilePath({ tenantCode, folder = 'default', fileName = '' }) {
  tenantCode = getO() || 'unknown';
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const suffix = getSuffix(fileName);
  // 使用生成的 uuid 作为文件名，原生文件名里有带中文的场景，这种场景生成的 url 存在兼容性问题
  return `${tenantCode}/${folder}/${year}/${month}/${day}/${uuid()}${suffix ? '.' + suffix : ''}`;
}

export async function doUpload(
  filePath,
  fileObj,
  options = {
    progress: p => {
      dlog.log(TAG, '上传进度 =>', filePath, p);
    }
  },
  stsConfig = null
) {
  dlog.log(TAG, 'doUpload() start =>', filePath);
  let config = stsConfig;
  if (stsConfig) {
    dlog.log(TAG, '正在使用外部传进来的 stsConfig', stsConfig);
  } else {
    config = await fetchStsConfig();
    dlog.log(TAG, 'fetchStsConfig()', config?.Type);
  }
  if (!config || !config.AccessKeyId || !config.AccessKeySecret || !config.SecurityToken) {
    dlog.log(TAG, 'stsConfig', config);
    throw new Error(`${TAG}：上传失败，请检查 stsConfig 的配置`);
  }
  const _options = {
    accessKeyId: config.AccessKeyId,
    secretAccessKey: config.AccessKeySecret,
    sessionToken: config.SecurityToken,
    endpoint: config.Endpoint,
    bucket: config.Bucket,
    expiration: config.Expiration,
    key: filePath,
    fileObj,
    ossType: config.Type,
    ...options
  };
  let res = null;
  try {
    res = await WebUpload.doUpload(_options);
  } catch (error) {
    dlog.log(TAG, error);
    throw new Error(error);
  }
  const _url = config.CustomDomain ? `${config.CustomDomain}/${filePath}` : '';
  const data = { url: _url || res.Location, ...res };
  if (!data.url) {
    dlog.log(TAG, 'file', data);
    throw new Error(`${TAG}：上传失败，文件下载的 url 为空`);
  }
  dlog.log(TAG, 'doUpload() finish =>', data);
  return data;
}

export const cancel = WebUpload.cancel;

export default {
  init
};
