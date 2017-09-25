const http = require('http');
const Controller = require('./server/controller');

// This is most certainly a development server unless previously specified
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Server object
// Options
//   on_request: A function to execute on every request (request);
//   routes: An object where the key is the route, value is the action(function)
//        action: The action function will receive (request, response) and will be
//                expected to handle completing the response.

const Server = function(opts) {
  opts = opts || {
    port: 3000,
  };

  // The node server
  let _server;

  // The controller from server/controller
  let _controller = new Controller();

  // Start the server.
  this.start = () => {
    console.log('Starting server...');
    // If there is no server create and listen
    if (!_server) {
      _startServer();
    }
  };


  /****
  * PRIVATE FUNCTIONS
  *****/

  // Handle incoming requests
  let _handleRequest = (req, res) => {
    // Log the request
    console.log(`Request: ${req.url}\n`)

    // If an on_request functionw as passed in the options...
    if (opts.hasOwnProperty('on_request') && (typeof opts.on_request) === 'function')
      opts.on_request(req);

    // Pass request to controller to handle
    _controller.respond(req, res);
  };

  // Start server
  let _startServer = () => {
    _server = http.createServer(_handleRequest);

    _setErrorListening();

    _server.listen(opts.port,() => {
      console.log(`Server running on localhost:${opts.port}...\n`);
    });
  };

  // Setup error handling for server
  let _setErrorListening = () => {

    // Handle general Errors
    _server.on('error', (err) => {
      // Port in use
      if (err.code == 'EADDRINUSE') {
        console.error(`Server Error: Port ${opts.port} is in use...`);
        return;
      };

      // Other errors
      console.error(`Server Error: ${err.toString()}`)
    });

    // Handle client error per nodejs docs
    _server.on('clientError', (err, socket) => {
      console.error(`Client Error: ${err.toString()}`)
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });
  }

};

module.exports = Server;
