const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    '/sseapi',
    createProxyMiddleware({
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/sseapi': '',
      },
      target: process.env.REACT_APP_SSE_SERVER,
    })
  );
};
