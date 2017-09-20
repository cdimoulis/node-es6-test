const server = require('./src/server');
const build = require('./build');

const option = process.argv[2];

if (option == 'server')
  server.start();
else
  build();
