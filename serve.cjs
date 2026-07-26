const http = require('http');
const fs = require('fs');
const path = require('path');

const dist = 'C:/Users/MSI/OneDrive/Documents/Default Project/m2-modular/dist';
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.yml': 'text/yaml',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  let fp = path.join(dist, urlPath === '/' ? 'index.html' : urlPath);
  
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    fp = path.join(dist, 'index.html');
  }
  
  const ext = path.extname(fp);
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  try {
    const content = fs.readFileSync(fp);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (e) {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(4173, () => {
  console.log('Server running at http://localhost:4173');
});
