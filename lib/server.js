const http = require('http');
const Controller = require('./server/controller');

// This is most certainly a development server
process.env.NODE_ENV = 'development';

const Server = function(opts) {

  // The node server
  let _server;

  // The controller
  let _controller = new Controller();

  this.start = () => {
    _server = http.createServer(_handleRequest);
    _server.listen(3000,() => {
      console.log('Server running on localhost:3000...\n');
    });
  };


  /****
  * PRIVATE FUNCTIONS
  *****/

  let _handleRequest = (req, res) => {
    console.log(`Request: ${req.url}\n`)
    _controller.respond(req, res);
  }

};

module.exports = Server;
