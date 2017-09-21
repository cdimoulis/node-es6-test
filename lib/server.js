const http = require('http');
const Controller = require('./server/controller');

// This is most certainly a development server
process.env.NODE_ENV = 'development';

// Server object
const Server = function(opts) {

  // The node server
  let _server;

  // The controller from server/controller
  let _controller = new Controller();

  // Start the server.
  this.start = () => {
    // If there is no server create and listen
    if (!_server) {
      _server = http.createServer(_handleRequest);
      _server.listen(3000,() => {
        console.log('Server running on localhost:3000...\n');
      });
    }
  };


  /****
  * PRIVATE FUNCTIONS
  *****/

  // Handle incoming requests
  let _handleRequest = (req, res) => {
    // Log the request
    console.log(`Request: ${req.url}\n`)
    // Pass request to controller to handle
    _controller.respond(req, res);
  }

};

module.exports = Server;
