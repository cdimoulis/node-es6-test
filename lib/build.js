const Babel = require('babel-core');
const Path = require('path');
const fs = require('fs');

const build = (opts) => {
  console.log('opts', opts);
  const pwd = process.env.PWD;

  let tmp_folder = fs.mkdtempSync('./tmp/');

  let src_files = fs.readdirSync(`.${Path.sep}src`);
  traverseFiles(src_files, `.${Path.sep}src`, tmp_folder);

}

function traverseFiles(files, path, tmp) {
  files.forEach((file) => {
    let full_path = `${path}${Path.sep}${file}`;
    let stat = fs.statSync(full_path);
    if (stat.isDirectory()) {
      let new_files = fs.readdirSync(full_path);
      let new_tmp = `${tmp}${Path.sep}${file}`
      traverseFiles(new_files, full_path, new_tmp);
    }
    else if (stat.isFile()){
      transformFile(file, path, tmp);
    }
  });
}

function transformFile(file, path, tmp) {
  let full_path = `${path}${Path.sep}${file}`;
  let code = Babel.transformFileSync(full_path,{}).code

  if (!fs.existsSync(tmp))
    fs.mkdirSync(tmp)

  let tmp_file = `${tmp}${Path.sep}${file}`;
  
  fs.writeFileSync(tmp_file,code);
}

module.exports = build;
