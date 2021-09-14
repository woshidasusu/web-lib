import BaseEventHandle from './base';

/**
 * 更新表单项的显示与隐藏
 */
export default class UpdateHiddenEvent extends BaseEventHandle {
  async exec() {
    const { targetFormItemId, value, conditions, conditionType = 'every' } = this.eventHandle;
    let result = true;
    if (conditions) {
      result = await this.coreProcessor.parseConditions(conditions, conditionType, this.eventData);
    }
    const metadataMap = this.coreProcessor.getStore()?.state()?.metadataMap || {};
    const targetItemMetadata = metadataMap[targetFormItemId];
    if (result && targetItemMetadata) {
      targetItemMetadata.hidden = +value;
    }
  }
}
