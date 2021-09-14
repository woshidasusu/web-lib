import dlog from '../dlog';
import getO from '../get-local-data/get-o';
import axios from './';

let domainType = 'host';
let domainUrl = ''; // 接口域名地址

/**
 * 接口请求的域名类型
 * @param {*} type host：直接使用当前页面的域名地址， dynamic：使用动态域名机制， fixed：配置的固定域名地址
 */
async function init() {
  domainType = window.GLOBAL_ENV?.VUE_APP_API_DOMAIN_TYPE || 'host';
  dlog.log('[domain]', '初始化 => 接口域名地址类型', domainType);
  await getDomain();
}

async function getDomain() {
  if (window.GLOBAL_ENV?.VUE_APP_ENV !== 'prod' && window.GLOBAL_ENV?.VUE_APP_DEBUG_HOST) {
    // 本地开发可以直接在 env.js 里修改配置或者借助 whistle 代理来配置接口环境
    // 后端同学也可以在控制台手动修改 window 变量来借助测试环境联调自己的开发机接口
    return window.GLOBAL_ENV?.VUE_APP_DEBUG_HOST;
  }
  if (domainUrl) {
    // 一个产品只有一个接口域名地址，如果已经缓存在内存，则后续直接使用即可，无需再解析域名地址
    return domainUrl;
  }
  if (domainType === 'dynamic') {
    // 动态域名机制
    domainUrl = getDomainUrlByO();
    if (!domainUrl) {
      await getDomainList();
      domainUrl = getDomainUrlByO();
    } else {
      // 如果本地已取到缓存数据，则进行一个不阻塞更新
      getDomainList();
    }
    return domainUrl;
  } else if (domainType === 'fixed') {
    // 固定接口域名地址
    domainUrl = window.GLOBAL_ENV?.VUE_APP_API_DOMAIN_URL;
    if (!domainUrl) {
      console.error(
        '[domain]',
        `当前环境(${window.GLOBAL_ENV?.VUE_APP_ENV})没有配置接口域名地址(VUE_APP_API_DOMAIN_URL)`
      );
    }
    return domainUrl;
  } else {
    // 默认 host 模式，即直接返回当前页面的域名地址
    domainUrl = `${location.protocol}//${location.host}/`;
    return domainUrl;
  }
}

// 根据租户获取动态域名地址
function getDomainUrlByO() {
  const site = window.GLOBAL_ENV?.VUE_APP_API_DOMAIN_SITE;
  if (!site) {
    console.error(
      '[domain]',
      `当前环境(${window.GLOBAL_ENV?.VUE_APP_ENV})没有配置接口域名站点(VUE_APP_API_DOMAIN_SITE)`
    );
    return;
  }
  let domainList = localStorage.getItem('domain_list');
  if (domainList) {
    try {
      domainList = JSON.parse(domainList);
      const o = getO();
      if (domainList[o]?.site_url && domainList[o].site_url[site]) {
        return domainList[o].site_url[site] || '';
      }
      if (domainList?.standard_tenant_code) {
        return domainList.standard_tenant_code[site] || '';
      }
    } catch (error) {
      console.error('[domain]', error);
    }
  }
}

async function getDomainList() {
  const url = window.GLOBAL_ENV?.VUE_APP_API_DOMAIN_BASE;
  if (!url) {
    console.error(
      '[domain]',
      `当前环境(${window.GLOBAL_ENV?.VUE_APP_ENV})没有配置动态域名获取地址(VUE_APP_API_DOMAIN_BASE)`
    );
    return;
  }
  const res = await axios.get(url).catch(() => {});
  if (res?.errcode === 0 && res?.data) {
    localStorage.setItem('domain_list', JSON.stringify(res.data));
  }
}

export default {
  init,
  getDomain
};
