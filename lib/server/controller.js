const fs = require('fs');
const build = require('../build');
const match = require('minimatch');

// Controller object to receive requests and find appropraite action
const Controller = function() {

  // Only entry to controller.
  // Using routes determin which action to take
  this.respond = (req, res) => {
    // If no action then call the 404\
    let action = _getRoute(req.url);
    action(req, res);
  };

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

    try {
      stat = fs.statSync(file_name);
    }catch (err) {
      console.error(err);
      return null;
    }

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

  // Inject the app into the html string
  let _injectApp = (html) => {
    if (html) {
      html = html.replace('  </head>', "    <script type='text/javascript' src='public/static/app.bundle.js' async defer></script>\n  </head>");
    }
    return html;
  };


  /***
  * ROUTES
  ****/

  let _getRoute = (route) => {
    let action, possibles = Object.keys(routes);
    // Find a match based on the keys of the routes
    possibles.some( (p) => {
      if (match(route, p)) {
        action = routes[p];
        return true;
      }

      return false;
    });
    return action || error_404;
  }

  // Routes are dumb. Simply an object with the route and the action function
  // Simply put route is key, action(function) is value
  let routes = {
    '**': getFile,
  };

};

module.exports = Controller;
