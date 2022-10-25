const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  const target = process.env.SSE_SERVER_LOCAL;
  // const target = process.env.SSE_SERVER_HEROKU;

  app.use(
    '/sseapi',
    createProxyMiddleware({
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/sseapi': '',
      },
      target,
    })
  );
};
