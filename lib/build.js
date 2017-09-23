const ES6 = require('./builds/es6');
const Webpack = require('webpack');
const WebpackConfig = require('./config/webpack.config');
const Path = require('path');

const build = (opts) => {
  opts = opts || {};
  // Get current environment. Either 'production' or 'development'
  let env = process.env.NODE_ENV || 'production';
  // The callback function when done;
  let done;

  // If done exists and is a funcion
  if (opts.hasOwnProperty('done') && (typeof opts.done) === 'function') {
    done = opts.done;
  }

  console.log(`Build: Starting ${env} build...`);

  let es6_config;

  // Complie ES6
  if (opts.hasOwnProperty('es6'))
    es6_config = opts['es6'];

  console.log("ES6: Compiling...");
  let es6 = new ES6(es6_config);
  // Build with callback to check for error and receive the temp folder created
  let tmp_folder = es6.build((err, folder) => {
    if (err) {
      console.log(err.toString());
      if (done) {
        done(err.toString());
      }
    }
    else {
      console.log("ES6: Done compiling!")
      bundle(folder);
    }
  });

  // Bundle with webpack
  function bundle(tmp_folder) {
    let entry = `${tmp_folder}${Path.sep}app.js`;
    let wp_config = WebpackConfig.js({
      entry: entry,
    });

    console.log('Bundler: starting...');
    Webpack(wp_config[env], (err, stats) => {
      let errors;
      if (err || stats.hasErrors()) {
        errors = err || stats.toJson().errors;
        console.error('Bundling Error:\n', parseErrors(errors));
      }
      else {
        console.log("Bundler: complete!");
      }
      cleanup();
      if (done) {
        done(parseErrors(errors));
      }
    });
  };

  // Remove all the temp files using es6 build clear
  function cleanup() {
    console.log('Build: Cleaning up...');
    es6.clear();
    console.log('Build: Done cleaning up.\n');
  };


  // Parse errors into a more readable string
  function parseErrors(errors) {
    if (!errors) return;
    let err_str = '\n';
    errors.forEach((error) => {
      err_str += error;
    });
    err_str += '\n';
    return err_str;
  };

}


module.exports = build;
