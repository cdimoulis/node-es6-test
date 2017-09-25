const Server = require('./lib/server');
const build = require('./lib/build');
const yargs = require('yargs');

// Set the options
setupOptions();
let argv = yargs.argv;

const server = new Server({
  on_request: onRequest,
  port: argv.port,
  routes: [
    ['/temp.js', temp],
    ['/love', (req, res) => {console.log('working?');}],
  ],
});

// Check options after server creation, before start
checkOptions();

server.start();



///// TEMP //////
function temp(req, res) {
  res.statusCode = 200;
  res.write('console.log("love");');
  res.end();
}




// On every request build the src code
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
    })
    // Show routes option
    .option('routes',{
      describe: 'Show available routes',
      alias: 'R'
    });
};

function checkOptions() {
  // If help then show and exit
  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

  // If show routes then show and exit
  if (argv.routes) {
    console.log(`\nRoutes:\n\n${server.getRoutes()}`)
    process.exit(0);
  }
}
