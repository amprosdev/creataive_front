const path = require('path');
const resolve = dir => path.resolve(__dirname, dir)


module.exports = {
  devServer: {
    proxy: {
      '/api/': {
        // target: 'https://api.creataive.net/',
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
        pathRewrite: {
          '/api': '/', // 将请求路径中的/api替换为空
        },
      },
    },
  },
  webpack: {
    alias: {
      '@': resolve('src'),
    }
  },
};
