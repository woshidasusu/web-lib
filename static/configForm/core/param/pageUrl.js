import BaseParam from './base';
import { getQuery } from '@/utils';

/**
 * 从 url 上获取 param 参数
 */
export default class PageUrlParam extends BaseParam {
  async exec() {
    const { key } = this.param;
    return {
      [key]: getQuery(key, location.href) || ''
    };
  }
}
