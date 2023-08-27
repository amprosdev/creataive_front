function isMac() {
  return /macintosh|mac os x/i.test(navigator.userAgent);
}

function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['iphone', 'ipod', 'ipad', 'android', 'windows phone', 'blackberry', 'webos', 'opera mini', 'iemobile', 'mobile'];

  return mobileKeywords.some((keyword) => userAgent.indexOf(keyword) !== -1);
}

function getBrowserLanguage() {
  return navigator.language === 'zh-CN' ? 'zh' : 'en'
}

export {
  isMac,
  isMobile,
  getBrowserLanguage,
}
