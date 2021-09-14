import getQuery from './get-query';
// import getCookie from './get-cookie';
import localstorage from '../localstorage';

// 获取租户 code，依次从以下地方获取租户 ：url, /* cookie */, localStorage,
function getO() {
  const o = getQuery('o') || /* getCookie('o') ||*/ localstorage.getString('o') || '';
  return o;
}

export default getO;
