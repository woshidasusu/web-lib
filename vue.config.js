'use strict';

const path = require('path');
const shelljs = require('shelljs');

function resolve(dir) {
  return path.join(__dirname, dir);
}

// 构建时间
const _name = shelljs.exec('git config user.name').stdout.trim();
const _buildTimeAndUser = 'update on ' + new Date() + ' by ' + _name;

module.exports = {
  configureWebpack: (config) => {
    config.resolve.alias = Object.assign({}, config.resolve.alias, {
      "@": resolve("src"),
      "@static": resolve("static")
    });
    const appName = "myapp";
    Object.assign(config.output, {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: appName,
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: "umd",
      // 按需加载相关，设置为 webpackJsonp_xxx 即可
      jsonpFunction: `webpackJsonp_${appName}`
    });
  },

  chainWebpack: config => {
    // 注入打包时间;
    config.plugin('html').tap(args => {
      args[0].buildTime = _buildTimeAndUser;
      return args;
    });

    // 去掉预检请求处理
    config.plugins.delete('prefetch');
  }
};
