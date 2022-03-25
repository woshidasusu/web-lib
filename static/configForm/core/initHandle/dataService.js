import BaseInitHandle from './base';

/**
 * 调用数据服务
 */
export default class DataServiceHandle extends BaseInitHandle {
  async exec() {
    this.log('exec() start, handle =', this.handle);
    // serviceName：函数名，args：参数对象（固定值类型），params：参数解析器解析参数
    const { serviceName, args, params } = this.handle;
    const dataService = this.coreProcessor.getDataService();
    if (dataService) {
      try {
        let _params = {};
        if (params) {
          _params = await this.coreProcessor.parseParams(params);
        }
        return await dataService.exec(serviceName, { ...args, ..._params });
      } catch (error) {
        console.error('[DataServiceHandle]', error);
      }
    } else {
      console.error('[DataServiceHandle] - exec() error, cause dataService is null');
    }
  }
}
