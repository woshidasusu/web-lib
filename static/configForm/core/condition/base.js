import CoreProcessor from '../index';
export default class BaseCondition {
  coreProcessor = new CoreProcessor();
  condition;

  constructor(coreProcessor, condition) {
    this.coreProcessor = coreProcessor;
    this.condition = condition;
  }

  async exec() {
    return false;
  }
}
