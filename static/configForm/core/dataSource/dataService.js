import BaseDataSource from './base';

/**
 * 调用数据服务
 */
export default class DataServiceDataSource extends BaseDataSource {
  async exec() {
    const { serviceName, args } = this.dataSource;
    const dataService = this.coreProcessor.getDataService();
    if (dataService) {
      try {
        return await dataService.exec(serviceName, { ...args });
      } catch (error) {
        console.error('[DataServiceDataSource]', error);
      }
    } else {
      console.error('[DataServiceDataSource] - exec() error, cause dataService is null');
    }
  }
}
