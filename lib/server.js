const http = require('http');
const fs = require('fs');

process.env.NODE_ENV = 'development';

const server = http.createServer((req, res) => {
  let public_html = getHTML();
  if (public_html) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(public_html);
  }
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Nope did not work');
  }
});

const start = () => {
  console.log('start')
  server.listen(3000,() => {
    console.log('Server running on localhost:3000');
  });
};

// Get the html from the public/index.html file
function getHTML(){
  if (fs.existsSync('public/index.html')){
    let html = fs.readFileSync('public/index.html');
    return html;
  }
  else {
    return null;
  }
}

module.exports = {
  start: start
};
