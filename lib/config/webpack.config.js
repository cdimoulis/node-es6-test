const path = require('path');

let js_config = {
  entry: './tmp/app.js',
  output: {
    path: path.resolve('./public', 'static'),
    filename: 'app.bundle.js',
  }
}

module.exports = {
  js: js_config,
};
