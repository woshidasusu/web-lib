/**
 * localStorage 使用 @yl/localstorage 库
 */
import localStorage from '@yl/localstorage';

function _localStorage() {
  if (!localStorage) {
    return {};
  }

  let isInit = false;
  /**
   * key 值前缀
   */
  let prefix = '';

  return {
    /**
     * 存储级别
     */
    level: {
      // 全局
      global: 0,
      // 租户级
      tenant: 1,
      // 用户级
      user: 2,
      // 产品级，非微前端场景用不到
      product: {
        tenant: 3,
        user: 4
      }
    },

    /**
     * 设置 key 值的前缀，外部读取都不需要手动拼接，内部会自动拼接前缀
     * @param {*} prefix
     */
    setPrefix: _prefix => {
      prefix = _prefix;
    },

    /**
     * 初始化方法，没有初始化只能存储全局信息
     * @param {string} tenantCode 租户code
     * @param {string} userID 用户id
     */
    init: (tenantCode, userID) => {
      isInit = true;
      localStorage.init(tenantCode, userID);
    },

    /**
     * 保存
     * @param {string} key 缓存key
     * @param {string|Object} value 值
     * @param {number} level 存储级别
     * @param {number} expireTime 保存的时长(单位：s)
     * @returns {*}
     */
    set: (key, value, level = 0, expireTime = 0) => {
      key = prefix + key;
      if (!isInit && level > 0) {
        console.error(
          '[localstorage]',
          '没有进行 localstorage.init(tenantCode, userID) 初始化，无法保存 level > 0 场景下的数据',
          { key, value, level }
        );
        return '';
      }
      return localStorage.set(key, value, level, expireTime);
    },

    /**
     * 以字符串的形式获取对应的内容，过期或者不存在返回空字符串
     *
     * @param {*} key
     * @param {number} [level=0]
     * @returns {string}
     */
    getString: (key, level = 0) => {
      key = prefix + key;
      if (!isInit && level > 0) {
        console.error(
          '[localstorage]',
          '没有进行 localstorage.init(tenantCode, userID) 初始化，无法获取 level > 0 场景下的数据',
          { key, level }
        );
        return '';
      }
      return localStorage.getString(key, level);
    },

    /**
     * 以对象的形式获取对应的内容，过期或者不存在返回false，如果值无法转为对象，则返回字符串
     *
     * @param {string} key
     * @param {number} [level=0]
     * @returns {Object|string}
     */
    getObject: (key, level = 0) => {
      key = prefix + key;
      if (!isInit && level > 0) {
        console.error(
          '[localstorage]',
          '没有进行 localstorage.init(tenantCode, userID) 初始化，无法获取 level > 0 场景下的数据',
          { key, level }
        );
        return '';
      }
      return localStorage.getObject(key, level);
    },

    /**
     * 设置需要被保护的缓存，在清除的时候不会被清除
     *
     * @param {string} key
     * @param {number} [level=0]
     */
    preserve: (key, level = 0) => {
      key = prefix + key;
      return localStorage.preserve(key, level);
    },

    /**
     * 删除指定的缓存项
     *
     * @param {string} key 键
     * @param {number} [level=0] 级别
     */
    remove: (key, level = 0) => {
      key = prefix + key;
      return localStorage.remove(key, level);
    },

    /**
     * 清除本地所有缓存，除被保护的缓存之外
     *
     * @returns {boolean}
     */
    clear: () => {
      return localStorage.clear();
    }
  };
}

export default _localStorage();
