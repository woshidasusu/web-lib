import BaseDataSource from './base';
import request from '../request';

/**
 * 从接口获取数据源
 */
export default class ApiDataSource extends BaseDataSource {
  async exec() {
    const { params } = this.dataSource;
    let _params = {};
    if (params) {
      _params = await this.coreProcessor.parseParams(params);
    }
    const result = await request({ ...this.dataSource, params: _params });
    return result;
  }
}
