import VConsole from 'vconsole';

window.__vconsole__ = function() {
  new VConsole();
};

let clickCount = 0;
let lastClickTime = 0;

export function openVConsoleByClick(count = 10) {
  // 默认连续点击 10 次开启 vconsole
  const now = new Date().getTime();
  if (now - lastClickTime > 1000) {
    // 点击间隔超过 1 s，重新计数
    clickCount = 0;
  } else {
    clickCount++;
  }
  lastClickTime = now;
  if (clickCount >= count) {
    console.warn('您已打开 vconsole');
    clickCount = 0;
    new VConsole();
  }
}
