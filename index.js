const server = require('./src/server');
const build = require('./build');

const option = process.argv[2];

if (option == 'server')
  server.start();
else
  build();


const fs = require('fs');

// var watcher = fs.watch('./src/test.js', {encoding: 'utf-8'}, (eventType, filename) => {
//   console.log('event', eventType, filename);
//   watcher.close();
// });
