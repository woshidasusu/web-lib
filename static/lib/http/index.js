import axios from '../axios';

const TAG = '[http]';

export function get(url, params, options) {
  return axios.get(url, params, options).catch(err => {
    // 捕获异常，确保外层可以直接使用 res.errcode 来判断接口情况
    console.error(TAG, err);
    return {};
  });
}

export function post(url, params, options) {
  return axios.post(url, params, options).catch(err => {
    // 捕获异常，确保外层可以直接使用 res.errcode 来判断接口情况
    console.error(TAG, err);
    return {};
  });
}

export function path(url, params, options) {
  return axios.path(url, params, options).catch(err => {
    // 捕获异常，确保外层可以直接使用 res.errcode 来判断接口情况
    console.error(TAG, err);
    return {};
  });
}

export default {
  get,
  post,
  path
};
