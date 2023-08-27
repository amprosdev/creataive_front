export const locales = [
  {
    locale: 'zh',
    getMessages: () => import(/* webpackChunkName: "zh" */ '../locales/zh.json'),
  },
  {
    locale: 'en',
    getMessages: () => import(/* webpackChunkName: "en" */ '../locales/en.json'),
  },
];
