const server = require('./src/server');

server.start();


// const fs = require('fs');

// var watcher = fs.watch('./src/test.js', {encoding: 'utf-8'}, (eventType, filename) => {
//   console.log('event', eventType, filename);
//   watcher.close();
// });
