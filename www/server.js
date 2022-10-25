const express = require('express');
const path = require('path');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = process.env.PORT || 3000;
const target = process.env.SSE_SERVER_LOCAL;
// const target = process.env.SSE_SERVER_HEROKU;

app.use(express.static(path.join(__dirname, 'build')));

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

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
