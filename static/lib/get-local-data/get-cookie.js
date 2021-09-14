function getCookie(key) {
  if (!key) {
    return document.cookie;
  }
  var strcookie = document.cookie;
  var arrcookie = strcookie.split('; ');
  for (var i = 0; i < arrcookie.length; i++) {
    var arr = arrcookie[i].split('=');
    if (arr[0] === key) {
      return arr[1];
    }
  }
  return '';
}

export default getCookie;
