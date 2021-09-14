import BaseInitHandle from './base';

/**
 * 调用数据服务
 */
export default class DataServiceHandle extends BaseInitHandle {
  async exec() {
    const { serviceName, args } = this.handle;
    const dataService = this.coreProcessor.getDataService();
    if (dataService) {
      try {
        return await dataService.exec(serviceName, args);
      } catch (error) {
        console.error('[DataServiceHandle]', error);
      }
    } else {
      console.error('[DataServiceHandle] - exec() error, cause dataService is null');
    }
  }
}
