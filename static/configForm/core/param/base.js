import CoreProcessor from '../index';
export default class BaseParam {
  coreProcessor = new CoreProcessor();
  param;

  constructor(coreProcessor, param) {
    this.coreProcessor = coreProcessor;
    this.param = param;
  }

  async exec() {}
}
