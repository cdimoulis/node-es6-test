const ES6 = require('./builds/es6');
const Webpack = require('webpack');
const WebpackConfig = require('./config/webpack.config');
const Path = require('path');

const build = (opts) => {
  opts = opts || {};
  let env = process.env.NODE_ENV || 'production';

  console.log(`Build: Starting ${env} build...`);

  let es6_config, webpack_config;

  // Complie ES6
  if (opts.hasOwnProperty('es6'))
    es6_config = opts['es6'];

  let es6 = new ES6(es6_config);
  let tmp_folder = es6.build();


  // Webpack
  let entry = `${tmp_folder}${Path.sep}app.js`;
  let wp_config = WebpackConfig.js({entry: entry});

  console.log('Bundler: starting...');
  Webpack(wp_config[env], (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(err);
    }
    else {
      console.log("Bundler: complete!");
      cleanup();
      if (opts.hasOwnProperty('done') && (typeof opts.done) === 'function') {
        opts.done();
      }
    }
  });;

  function cleanup() {
    console.log('Build: Cleaning up...');
    es6.clear();
    console.log('Build: Done cleaning up.\n');
  };

}


module.exports = build;
