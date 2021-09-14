import BaseCondition from './base';

/**
 * 调用数据服务
 */
export default class DataServiceCondition extends BaseCondition {
  async exec() {
    const { serviceName, args } = this.condition;
    const dataService = this.coreProcessor.getDataService();
    if (dataService) {
      try {
        return await dataService.exec(serviceName, { ...args });
      } catch (error) {
        console.error('[DataServiceCondition]', error);
      }
    } else {
      console.error('[DataServiceCondition] - exec() error, cause dataService is null');
    }
  }
}
