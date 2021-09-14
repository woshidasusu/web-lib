import WaterMark from '@yl/page-watermark';
import getO from '../get-local-data/get-o';
import getLocalData from '../get-local-data';

function init(options) {
  // 水印默认配置
  var _date = new Date();
  var year = _date.getFullYear();
  var month = _date.getMonth() + 1;
  var day = _date.getDate();
  var today = (year + '').slice(-2) + ('00' + month).slice(-2) + ('00' + day).slice(-2);
  var tenantCode = getO();
  var userAccount = getLocalData('account');
  WaterMark.loadMark({
    watermark_txt: `${tenantCode}（${userAccount}）${today} `, // 水印的内容
    watermark_parent_node: '#waterMarkDom',
    watermark_angle: 26,
    watermark_x_space: 400,
    watermark_y_space: 30,
    watermark_height: 60,
    watermark_alpha: 0.05,
    watermark_color: '#000000',
    ...options
  });
}

export default {
  init
};
