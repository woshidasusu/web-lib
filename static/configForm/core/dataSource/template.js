import BaseDataSource from './base';
/**
 *  从模板字段中读取数据源
 */
export default class WindowDataSource extends BaseDataSource {
  async exec() {
    const { dataKey } = this.dataSource;
    const key = dataKey || 'options';
    return this.dataSource[key];
  }
}
