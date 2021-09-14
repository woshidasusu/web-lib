function enable() {
  return window.GLOBAL_ENV?.VUE_APP_ENV === 'dev' || window.__debug_log__;
}

function log(...args) {
  enable() && console.log(...args);
}

function debug(...args) {
  enable() && console.debug(...args);
}

// 调试日志需要控制输出的场景
export default {
  log,
  debug
};
