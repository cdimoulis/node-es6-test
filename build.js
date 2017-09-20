const Babel = require('babel-core');

const build = () => {
  console.log('process', process.env.PWD);
  const pwd = process.env.PWD;

  var file = pwd+'/src/test.js';
  var code = Babel.transformFileSync(file,{}).code

  console.log(code);
}

module.exports = build;
