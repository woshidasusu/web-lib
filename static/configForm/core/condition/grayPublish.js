import BaseCondition from './base';

/**
 * 根据灰度开关
 */
export default class GrayPublishCondition extends BaseCondition {
  async exec() {
    const { code, value } = this.condition;
    const grayPublish = this.coreProcessor.getGrayPublish();
    return grayPublish[code] === value;
  }
}
