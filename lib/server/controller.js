const fs = require('fs');
const match = require('minimatch');
const Router = require('./router');

// Controller object to receive requests and find appropraite action
const Controller = function(opts) {
  opts = opts || {};

  // Contains all routes
  let _router = new Router();

  // Only entry to controller.
  // Using routes determine which action to take
  this.respond = (req, res) => {
    // If no action then call the 404\
    // let action = _getRoute(req.url);
    let action = _router.getAction(req.url);
    action(req, res);
  };

  // Get all the routes
  this.getRoutes = () => {
    return _router.toString();
  }

  /***
  * ACTIONS
  ****/

  let getFile = (req, res) => {
    let file_name = req.url[0] === '/' ? req.url.slice(1) : req.url;
    let file = _getFile(file_name);
    if (file) {
      res.statusCode = 200;
      res.write(file);
      res.end();
    }
    else {
      error_404(req, res);
    }
  }

  /***
  * Errors
  ****/

  // return a 4040 and message
  let error_404 = (req,res) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.write('I could not find that');
    res.end();
  };



  /***
  * Private FUNCTIONS
  ****/

  // Get the contents of a file in string form
  let _getFile = (file_name) => {
    if (file_name.indexOf('public') != 0)
      file_name = `public/${file_name}`;
    let file, stat;

    // Get the file stat to see type
    try {
      stat = fs.statSync(file_name);
    }catch (err) {
      console.error(err);
      return null;
    }

    // If is directory then try to get an index.html
    if (stat.isDirectory()) {
      file_name += 'index.html';
    }

    // If the file_name and a file by that name exist
    try {
      if (file_name && fs.existsSync(file_name)) {
        // read in file to buffer
        file = fs.readFileSync(file_name);
        if (file)
          // Send back the string
          return file.toString();
        else
          return null;
      }
    }
    catch (err) {
      console.error(err);
      return null;
    }

    return null
  };


  /***
  * ROUTER
  ****/
  // Default Routes which simply sends all to the getFile action.
  // Any routes passed in will be PREPENDED to this (thus getFile becomes default)
  // Replace ** with desired default (null if no default desired);
  // Uses minimatch for route matching.
  // Simply put index 0 is route string, index 1 is action(function)
  let default_routes = [
    ['**', getFile],
  ];

  // Set the routes in the Router
  if (opts.hasOwnProperty('routes') && Array.isArray(opts.routes)) {
    let routes = opts.routes;
    routes.forEach( (route) => {
      if (!_router.hasRoute(route[0]))
        _router.addRoute(route[0], route[1]);
    });
  }

  // Add default routes
  default_routes.forEach( (route) => {
    if (!_router.hasRoute(route[0]))
      _router.addRoute(route[0], route[1]);
  });

};

module.exports = Controller;
