const fs = require('fs');
const build = require('../build');

// Controller object to receive requests and find appropraite action
// TODO: Allow for non index requests.
//       Make a dumb router which simply looks for files
const Controller = function() {

  // Only entry to controller.
  // Using routes determin which action to take
  this.respond = (req, res) => {
    // If no action then call the 404
    let action = routes[req.url] || error_404;
    action(req, res);
  };

  /***
  * ACTIONS
  ****/

  // Index will get the public/index.html file
  let index = (req,res) => {
    // get the html in string form
    let html = _getFile('public/index.html');
    // inject the app js file
    html = _injectApp(html);
    // If there is no problem
    if (html) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write(html);
      res.end();
    }
    else {
      error_404(req, res);
    }
  };

  // Get the js file per the req.url
  // TODO: Make the routes accept any js file.
  //       This function should handle any js file
  let js = (req,res) => {
    build({done: (err) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.write(err);
        res.end();
      }
      else {
        let js_file = _getFile(`.${req.url}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/javascript');
        res.write(js_file);
        res.end();
      }
    }});
  };

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
    let file;
    // If the file_name and a file by that name exist
    if (file_name && fs.existsSync(file_name)) {
      // read in file to buffer
      file = fs.readFileSync(file_name);
      if (file)
        // Send back the string
        return file.toString();
      else
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

  // Routes are dumb. Simply an object with the route and the action function
  // TODO: Create a way to accept file "types". i.e. .js, .css files and
  //       serve them. This should be dumb and simply grab a file at the route.
  let routes = {
    '/': index,
    '/public/static/app.bundle.js': js,
  };

};

module.exports = Controller;
