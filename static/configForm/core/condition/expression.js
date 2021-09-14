import BaseCondition from './base';

export default class ExpressionCondition extends BaseCondition {
  async exec() {
    const expr = this.coreProcessor.getExpresstion(this.condition);
    const res = await expr.exec();
    return res;
  }
}
