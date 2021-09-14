import BaseExpression from './base';

export default class NeExpression extends BaseExpression {
  async exec() {
    const { leftOperate, leftDataSource, rightOperate, rightDataSource } = this.expression;
    let leftOpe = leftOperate;
    let rightOpe = rightOperate;
    if (leftDataSource) {
      leftOpe = await this.coreProcessor.getDataSource(leftDataSource).exec();
    }
    if (rightDataSource) {
      rightOpe = await this.coreProcessor.getDataSource(rightDataSource).exec();
    }
    return leftOpe !== rightOpe;
  }
}
