import BaseInitHandle from './base';

/**
 * 设置表单项的禁用状态
 */
export default class DisableHandle extends BaseInitHandle {
  async exec() {
    const { value } = this.handle;
    const metadata = this.coreProcessor.getStore()?.state()?.metadataMap[this._id];
    if (metadata) {
      metadata.disabled = value;
    }
  }
}
