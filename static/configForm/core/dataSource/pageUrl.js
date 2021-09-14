import BaseDataSource from './base';
import { getQuery } from '@/utils';
/**
 *  从 url 上获取数据
 */
export default class PageUrlDataSource extends BaseDataSource {
  async exec() {
    const { dataKey } = this.dataSource;
    return getQuery(dataKey, location.href) || '';
  }
}
