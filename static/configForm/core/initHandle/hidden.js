import BaseInitHandle from './base';

/**
 * 设置表单项的隐藏和显示
 */
export default class HiddenHandle extends BaseInitHandle {
  async exec() {
    const { value } = this.handle;
    const metadata = this.coreProcessor.getStore()?.state()?.metadataMap[this._id];
    if (metadata) {
      metadata.hidden = value;
    }
  }
}
