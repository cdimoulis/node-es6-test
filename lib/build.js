const Babel = require('babel-core');
const fs = require('fs');

const build = (opts) => {
  console.log('opts', opts);
  const pwd = process.env.PWD;

  if (!fs.existsSync('./build'))
    fs.mkdirSync('./build');

  let src_files = fs.readdirSync('./src');
  traverseFiles(src_files, './src');

}

function traverseFiles(files, path) {
  files.forEach((file) => {
    let full_path = `${path}/${file}`;
    let stat = fs.statSync(full_path);
    if (stat.isDirectory()) {
      let new_files = fs.readdirSync(full_path);
      traverseFiles(new_files, full_path);
    }
    else if (stat.isFile()){
      transformFile(full_path, path);
    }
  });
}

function transformFile(file, path) {
  let code = Babel.transformFileSync(file,{}).code
  let build_path = path.replace('/src/', '/build/');
  let build_file = file.replace('/src/', '/build/');

  if (!fs.existsSync(build_path))
    fs.mkdirSync(build_path);

  console.log('Babel build file:',build_file);
  fs.writeFileSync(build_file,code);
}

module.exports = build;
