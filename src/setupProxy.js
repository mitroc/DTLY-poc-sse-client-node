const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  const target = 'https://mitroc-sse-server.herokuapp.com';

  app.use(
    '/sseapi',
    createProxyMiddleware({
      changeOrigin: true,
      target,
      pathRewrite: {
        '^/sseapi': '',
      },
      logLevel: 'debug',
    })
  );
};
