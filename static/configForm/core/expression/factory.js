import NeExpression from './ne';
import EqExpression from './eq';

export default function getExpresstion(coreProcessor, expression, extraArgs = {}) {
  const { expression: type } = expression;
  const Cls = {
    '==': EqExpression,
    '===': EqExpression,
    '!=': NeExpression,
    '!==': NeExpression
  }[type];
  return new Cls(coreProcessor, expression, extraArgs);
}
