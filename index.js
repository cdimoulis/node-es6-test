const Server = require('./lib/server');
const build = require('./lib/build');
const yargs = require('yargs');

// Set the options
setupOptions();

let argv = yargs.argv;

// If help then show and exit
if (argv.help) {
  yargs.showHelp();
  process.exit(0);
}


const server = new Server({
  on_request: onRequest,
  port: argv.port,
});

server.start();

function onRequest(req) {
  // Build if request is for js
  if (req.url === '/public/static/app.bundle.js')
    build();
};


// Setup the yargs options
function setupOptions() {
  yargs
    // Help option
    .option('help', {
      describe: 'Help documentation',
      alias: 'h',
    })
    // Port Option
    .option('port',{
      describe: 'Port to bind on',
      alias: 'p',
      default: 3000,
    });
};
