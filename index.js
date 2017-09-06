const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Working my man');
});

server.listen(3000,() => {
  console.log('Server running on localhost:3000');
});
