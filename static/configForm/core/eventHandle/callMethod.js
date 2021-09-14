import BaseEventHandle from './base';

/**
 * 调用直接子组件内置的方法
 */
export default class CallMethodEvent extends BaseEventHandle {
  async exec() {
    const { targetFormItemId, method } = this.eventHandle;
    const targetFormItemRef = this.coreProcessor.getPageInstance()?.$refs[targetFormItemId];
    const elRef = targetFormItemRef && targetFormItemRef[0];
    if (elRef) {
      // 固定传入事件返回的数据
      elRef[method](this.eventData);
    }
  }
}
