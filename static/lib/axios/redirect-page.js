const REDIRECT_COUNT = '__redirect_count__';
const REDIRECT_TIME = '__redirect_time__';

// 去重处理
let isOnRedircting = false;

// 重新打开指定页面
export default function redirectPage(url) {
  // 去重处理
  if (!isOnRedircting) {
    isOnRedircting = true;
    let count = +(localStorage.getItem(REDIRECT_COUNT) || 0);
    const time = localStorage.getItem(REDIRECT_TIME) || 0;
    const now = new Date().getTime();
    localStorage.setItem(REDIRECT_TIME, now);
    if (now - time > 5000) {
      count = 0;
      localStorage.removeItem(REDIRECT_COUNT);
    } else {
      localStorage.setItem(REDIRECT_COUNT, +count + 1);
    }
    if (count > 3) {
      console.error('[redirect-page]', '短时间内，重定向次数超过 3 次，自动跳转到 404');
      location.replace('/404');
    } else {
      location.replace(url);
    }
  }
}
