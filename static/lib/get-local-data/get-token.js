import getQuery from './get-query';
// import getCookie from './get-cookie';
import localstorage from '../localstorage';

// 获取token，依次从以下地方获取 ：url, /* cookie, */ localStorage,
function getToken() {
  const o = getQuery('token') || /* getCookie('token') || */ localstorage.getString('token') || '';
  return o;
}

export default getToken;
