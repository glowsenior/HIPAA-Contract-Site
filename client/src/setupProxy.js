const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://5.196.110.210:5000',
      changeOrigin: true,
    })
  );
};
