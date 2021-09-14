import PageUrlParam from './pageUrl';
import ConstantParam from './constant';

export default function getParam(coreProcessor, param, extraArgs = {}) {
  let { type } = param;
  if (!type) {
    // 兼容第一版没有设计 param 时的元数据解析
    if ('valueFrom' in param) {
      type = param.valueFrom || 'pageUrl';
    } else if ('value' in param) {
      type = 'constant';
    }
  }
  const Cls = {
    pageUrl: PageUrlParam,
    constant: ConstantParam
  }[type];
  return new Cls(coreProcessor, param, extraArgs);
}
