import BaseEventHandle from './base';

/**
 * 更新表单模型字段：formModel[formModelKey] = eventData[eventDataKey]
 *
 * 支持通过 , 连接符来更新多个字段 e.g: formModelKey = 'a,b' eventDataKey: 'a,b' => formModel.a = eventData.a; formModel.b = eventData.b;
 * 支持通过 . 连接符来更新内嵌字段 e.g: formModelKey = 'a.b.c' => formModel.a.b.c = eventData[eventDataKey]
 * 特殊场景：如果需要遍历数组更新子项对象上的字段，可以通过 : 连接符 e.g: formModelKey = 'a:b' => formModel.a.forEach(v => v.b  = eventData[eventDataKey]);
 */
export default class UpdateModelEvent extends BaseEventHandle {
  async exec() {
    const { formModelKey, eventDataKey } = this.eventHandle;
    const formModel = this.coreProcessor.getFormModel();
    const eventData = this.eventData;
    // 解析 . 连接符，获取最后一层字段挂载的对象
    const parseProp = (obj, keys) => {
      let parentObj = obj;
      while (keys.length > 1) {
        const key = keys.shift();
        parentObj = parentObj[key];
      }
      return parentObj;
    };

    let parent = formModel;
    const targetKeys = formModelKey.split(',');
    const sourceKeys = eventDataKey.split(',');
    if (targetKeys[0].indexOf(':') > -1) {
      // 如果有设置数组的场景，获取数组对象
      let [arrayKeys, firstPropKey] = targetKeys[0].split(':');
      arrayKeys = arrayKeys.split('.');
      parent = parseProp(formModel, arrayKeys);
      parent = parent[arrayKeys.shift()];
      targetKeys.splice(0, 1, firstPropKey);
    }

    // 根据计算得到到 key 更新 parent 对象上的属性
    const updateModel = parent => {
      targetKeys.forEach((keyPath, i) => {
        const k1 = keyPath.split('.');
        const target = parseProp(parent, k1);
        const k2 = sourceKeys[i].split('.');
        const source = parseProp(eventData, k2);
        target[k1.shift()] = source[k2.shift()];
      });
    };

    if (Array.isArray(parent)) {
      parent.forEach(v => {
        updateModel(v);
      });
    } else {
      updateModel(parent);
    }
  }
}
