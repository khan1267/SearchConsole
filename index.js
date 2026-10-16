const handler = require('./api/index.js');
module.exports = handler;

if (require.main === module) {
  const http = require('http');
  const PORT = process.env.PORT || 3000;
  http.createServer(handler).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
