import BaseParam from './base';

/**
 * 常量类型参数
 */
export default class ConstantParam extends BaseParam {
  async exec() {
    const { key, value } = this.param;
    return {
      [key]: value
    };
  }
}
