const fs = require('fs');
const build = require('../build');

const Controller = function() {

  this.respond = (req, res) => {
    let action = routes[req.url] || error_404;
    action(req, res);
  };

  /***
  * ACTIONS
  ****/

  let index = (req,res) => {
    let html = _getFile('public/index.html');
    html = _injectApp(html);
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

  let js = (req,res) => {
    build({done: () => {
      let js_file = _getFile(`.${req.url}`);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/javascript');
      res.write(js_file);
      res.end();
    }});
  };

  let error_404 = (req,res) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Nope did not work');
    res.end();
  };



  /***
  * Private FUNCTIONS
  ****/

  let _getFile = (file_name) => {
    let file;
    if (file_name && fs.existsSync(file_name)) {
      file = fs.readFileSync(file_name);
      if (file)
        return file.toString();
      else
        return null;
    }

    return null
  };

  let _injectApp = (html) => {
    if (html) {
      html = html.replace('  </head>', "    <script type='text/javascript' src='public/static/app.bundle.js' async defer></script>\n  </head>");
    }
    return html;
  };


  /***
  * ROUTES
  ****/

  let routes = {
    '/': index,
    '/public/static/app.bundle.js': js,
  };

};

module.exports = Controller;
