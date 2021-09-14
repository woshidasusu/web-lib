import BaseDataSource from './base';
/**
 *  从 formModel 表单数据模型上取数
 */
export default class FormModelDataSource extends BaseDataSource {
  async exec() {
    const { dataKey } = this.dataSource;
    let result = this.coreProcessor.getFormModel();
    // dataKey 支持设置 . 来取内嵌字段
    const dataKeys = dataKey.split('.');
    while (dataKeys.length > 0) {
      if (result == null) {
        console.error('[FormModelDataSource]', dataKey + ' 读取异常，请检查数据结构');
        break;
      }
      const key = dataKeys.shift();
      result = result[key];
    }
    return result;
  }
}
