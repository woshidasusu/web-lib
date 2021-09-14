import BaseEventHandle from './base';

/**
 * 调用数据服务
 */
export default class DataServiceEvent extends BaseEventHandle {
  async exec() {
    const { serviceName, args } = this.eventHandle;
    const dataService = this.coreProcessor.getDataService();
    if (dataService) {
      try {
        return await dataService.exec(serviceName, { $event: this.eventData, ...args });
      } catch (error) {
        console.error('[DataServiceEvent]', error);
      }
    } else {
      console.error('[DataServiceEvent] - exec() error, cause dataService is null');
    }
  }
}
