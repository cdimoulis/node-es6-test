const Babel = require('babel-core');
const Path = require('path');
const fs = require('fs');

// Object to export
// build: build the
const ES6 = function(opts) {
  opts = opts || {};
  let tmp_folder;

  this.build = (opts) => {
    console.log("ES6: Compiling...")
    const pwd = process.env.PWD;

    if (!fs.existsSync('./tmp/'))
      fs.mkdirSync('./tmp/')

    tmp_folder = fs.mkdtempSync('./tmp/');

    let src_files = fs.readdirSync(`.${Path.sep}src`);
    traverseFiles(src_files, `.${Path.sep}src`, tmp_folder);
    console.log("ES6: Done compiling!")
    return tmp_folder;
  };

  this.clear = (opts) => {
    removeTmpFiles(tmp_folder);
  };

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

function removeTmpFiles(tmp) {
  let files = fs.readdirSync(tmp);
  files.forEach((file) => {
    let full_path = `${tmp}${Path.sep}${file}`;
    let stat = fs.statSync(full_path);
    if (stat.isDirectory()) {
      removeTmpFiles(full_path);
    }
    else{
      fs.unlinkSync(full_path);
    }
  });

  // Remove the directory
  if (fs.existsSync(tmp))
    fs.rmdirSync(tmp);
}

module.exports = ES6;
