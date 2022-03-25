import CoreProcessor from '../index';
export default class BaseParam {
  coreProcessor = new CoreProcessor();
  param;

  constructor(coreProcessor, param) {
    this.coreProcessor = coreProcessor;
    this.param = param;
  }

  async exec() {}

  log(...args) {
    if (window.__debug_log__) {
      console.log(`[param/${this.param.type}]`, ...args);
    }
  }
}
