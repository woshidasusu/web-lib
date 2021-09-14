import dlog from '../dlog';
import getO from '../get-local-data/get-o';

const TAG = '[aop-config]：';

let aopConfig = {};
let routerMap = {};

function init(router, { url = '', config = {}, routers = [] }) {
  if (!router) {
    console.error(TAG, 'router is null');
    return;
  }
  // TODO 根据 url 拉取配置，建议不阻塞执行，因为需要考虑弱网和无网场景
  try {
    parseAopConfig(router, config);
    parseRouters(router, routers);
  } catch (error) {
    console.error(TAG, error);
  }
  handleBeforeRoute(router);
  dlog.log(TAG, '初始化 => aop 配置');
}

// 更新配置
// function update(config, routers) {
//   try {
//     parseAopConfig(config);
//     parseRouters(routers);
//   } catch (error) {
//     console.error(TAG, error);
//   }
// }

function parseAopConfig(router, config) {
  if (config && config.router) {
    aopConfig = config.router;
  }

  dlog.log(TAG, 'aopConfig', aopConfig);
}

function parseRouters(router, routers) {
  if (routers) {
    // 动态注册路由
    if (router.addRoutes) {
      router.addRoutes(routers);
    } else if (router.addRoute) {
      routers.forEach(v => {
        router.addRoute(v);
      });
    } else {
      console.error(TAG, '当前 vue-router 版本不支持动态注册路由');
      return;
    }
    // 递归解析所有路由，以 name 或 path 做 key 值缓存
    const stack = [...routers];
    while (stack.length) {
      const cur = stack.shift();
      if (cur.name) {
        routerMap[cur.name] = {
          name: cur.name
        };
      } else if (cur.path) {
        routerMap[cur.path] = {
          path: cur.path
        };
      }
      if (cur.children) {
        stack.push(...cur.children);
      }
    }
  }
  dlog.log(TAG, 'routerMap', routerMap);
}

function handleBeforeRoute(router) {
  router.beforeEach((to, from, next) => {
    const name = to?.name;
    if (!aopConfig[name]) {
      next();
      return;
    }
    const o = getO();
    if (!o || !aopConfig[name][o]) {
      next();
      return;
    }
    const aopName = aopConfig[name][o];
    if (routerMap[aopName]) {
      console.warn(TAG, `检测到当前路由(${name})有配置 aop，跳转到 aop 路由(${aopName})`);
      next(routerMap[aopName]);
    } else {
      next();
    }
  });
}

export default {
  init
};
