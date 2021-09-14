import BaseInitHandle from './base';

/**
 * 设置表单项的初始值
 */
export default class ModelHandle extends BaseInitHandle {
  async exec() {
    const { dataSource } = this.handle;
    const metadata = this.coreProcessor.getStore()?.state()?.metadataMap[this._id];
    const formModel = this.coreProcessor.getFormModel();
    if (metadata && formModel) {
      this.coreProcessor
        .getDataSource(dataSource)
        .exec()
        .then(value => {
          formModel[metadata.name] = value;
        });
    }
  }
}
