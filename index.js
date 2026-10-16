const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=UTF-8',
  '.txt': 'text/plain; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// Request handler for both Vercel Serverless and local Node.js server
function handler(req, res) {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Support clean URLs: e.g. /services -> /services.html
  let filePath = path.join(__dirname, reqPath);
  if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  // Security check to prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.end('403 Forbidden');
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.end(fs.readFileSync(filePath));
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.end('<h1>404 Not Found</h1><p><a href="/">Return to Home</a></p>');
}

// Export for Vercel
module.exports = handler;

// Run standalone server if executed directly (e.g. node index.js or npm start)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    console.log(`\n🚀 AcuitySEO Server running at: http://localhost:${PORT}`);
    console.log(`📡 Google Search Console ready. Press Ctrl+C to stop.\n`);
  });
}
