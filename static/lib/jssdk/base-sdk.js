export default class BaseSdk {
  config() {
    throw new Error('您还未实现 config 方法');
  }

  /**
   * 参数转为字符串，可用于日志记录，以便上传天眼。（转换的日志可直接在控制台执行，来复现 api 调用）
   * @param {*} args
   * @returns
   */
  argsToString(args = []) {
    const argToString = arg => {
      if (typeof arg === 'function') {
        return 'function() {}';
      }
      if (typeof arg === 'object' && arg !== null) {
        return (
          '{' +
          Object.keys(arg)
            .map(v => v + ': ' + argToString(arg[v]))
            .join(', ') +
          '}'
        );
      }
      return JSON.stringify(arg);
    };
    return args.map(v => argToString(v)).join(', ');
  }
}
