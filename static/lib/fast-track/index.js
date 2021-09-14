import dlog from '../dlog';

if (window.GLOBAL_ENV?.VUE_APP_PRODUCT_CODE && window.GLOBAL_ENV?.VUE_APP_YY_CODE) {
  init(window.GLOBAL_ENV.VUE_APP_PRODUCT_CODE, window.GLOBAL_ENV.VUE_APP_YY_CODE);
}

function init(productCode, appCode) {
  const eyeSrc =
    'https://mic-open.mypaas.com.cn/web-log-tracker/' + productCode + '/' + appCode + '/myWebLogTracker.min.js';
  const eyeScript = document.createElement('script');
  eyeScript.src = eyeSrc;
  eyeScript.async = 1;
  document.head.appendChild(eyeScript);

  // 记录日志
  console.error = (function(originFn) {
    return function(...args) {
      window.$log('error日志', args);
      originFn.call(console, ...args);
    };
  })(console.error);
  console.warn = (function(originFn) {
    return function(...args) {
      window.$log('warn日志', args);
      originFn.call(console, ...args);
    };
  })(console.warn);
  dlog.log('[fast-track]', '初始化 => 天眼配置');
}

function $log(tag, info) {
  if (window.__myWebLogTracker__ && window.__myWebLogTracker__.report) {
    try {
      window.__myWebLogTracker__.report(tag, info);
    } catch (error) {
      console.log('error日志', error); // 不能用 error，否则处理不当会进入死循环
    }
  } else if (!['error日志', 'warn日志'].includes(tag)) {
    console.warn('未接入天眼，日志无法上报', tag, info);
  }
}

// 全局挂载天眼埋点方法
window.$log = $log;
