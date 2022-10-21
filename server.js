const express = require('express');
const path = require('path');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'build')));

app.use(
  '/sseapi',
  createProxyMiddleware({
    target: 'https://mitroc-sse-server.herokuapp.com',
    changeOrigin: true,
    pathRewrite: {
      '^/sseapi': '',
    },
    logLevel: 'debug',
  })
);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
