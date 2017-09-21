const webpack = require('webpack');
const path = require('path');

// Pass in opts to setup configs
//   opts.entry: the name of the entry file
let js_config = (opts) => {
  opts = opts || {};

  let config = {
    // Config for production
    production: {
      entry: opts.entry,
      output: {
        path: path.resolve('.', 'build'),
        filename: 'app.js',
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin(),
      ]
    },
    // Config for development
    development: {
      entry: opts.entry,
      output: {
        path: path.resolve('./public', 'static'),
        filename: 'app.bundle.js',
      },
    }
  }

  return config;
}

module.exports = {
  js: js_config,
};
