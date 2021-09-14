import dlog from '../dlog';

const THEME = 'theme';
let curTheme = '';

function init() {
  curTheme = localStorage.getItem(THEME) || '';
  if (curTheme) {
    document.body.classList.add(curTheme);
  }
  dlog.log('[theme]', '初始化 => 主题配置：', curTheme);
}

function change(theme) {
  document.body.classList.remove(curTheme);
  curTheme = theme;
  localStorage.setItem(THEME, theme);
  document.body.classList.add(theme);
  dlog.log('[theme]', '更改主题配置：', curTheme);
}

export default {
  init,
  change
};
