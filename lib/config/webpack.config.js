const webpack = require('webpack');
const path = require('path');

let js_config = (opts) => {
  opts = opts || {};

  let config = {
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
