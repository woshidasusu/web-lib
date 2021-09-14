/**
 * 根据文件名获取文件后缀
 * @param {*} name
 * @returns
 */
export function getSuffix(name) {
  if (name && name.lastIndexOf('.') > -1) {
    return name.substr(name.lastIndexOf('.') + 1);
  }
  return '';
}

/**
 * 根据 url 获取文件名
 * @param {*} url
 */
export function getFileName(url) {
  if (url) {
    return url.substr(url.lastIndexOf('/') + 1);
  }
  return '';
}

/**
 * 将文件大小（单位：byte）转换为带单位的字符串
 * @param {*} size
 * @returns
 */
export function sizeTostr(size) {
  var data = '';
  size = Number(size);
  if (size < 1 * 1024) {
    //如果小于1KB转化成B
    data = size.toFixed(2) + 'B';
  } else if (size < 1 * 1024 * 1024) {
    //如果小于1MB转化成KB
    data = (size / 1024).toFixed(2) + 'KB';
  } else if (size < 1 * 1024 * 1024 * 1024) {
    //如果小于1GB转化成MB
    data = (size / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    //其他转化成GB
    data = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }
  var sizestr = data + '';
  var len = sizestr.indexOf('.');
  var dec = sizestr.substr(len + 1, 2);
  if (dec == '00') {
    //当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}
