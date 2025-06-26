const http = require('http');
http.createServer((req, res) => {
  if (req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('pong');
  } else {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(process.env.PORT || 3000);
