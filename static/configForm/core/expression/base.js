import CoreProcessor from '../index';

export default class BaseExpression {
  coreProcessor = new CoreProcessor();
  expression;

  constructor(coreProcessor, expression) {
    this.coreProcessor = coreProcessor;
    this.expression = expression;
  }

  async exec() {
    return false;
  }
}
