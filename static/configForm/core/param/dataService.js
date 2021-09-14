import BaseParam from './base';

/**
 * 调用数据服务
 */
export default class DataServiceParam extends BaseParam {
  async exec() {
    const { serviceName, args } = this.param;
    const dataService = this.coreProcessor.getDataService();
    if (dataService) {
      try {
        return await dataService.exec(serviceName, args);
      } catch (error) {
        console.error('[DataServiceParam]', error);
      }
    } else {
      console.error('[DataServiceParam] - exec() error, cause dataService is null');
    }
  }
}
