const Babel = require('babel-core');
const Path = require('path');
const fs = require('fs');

// Object to export
// build: build the
// clear: remove the temp files
const ES6 = function(opts) {
  opts = opts || {};
  // Temp directory should be available in all functions
  let tmp_directory;

  // Compile the ES6 files.
  // Place in a temp directory in /tmp
  this.build = (opts) => {
    console.log("ES6: Compiling...");

    // If /tmp directory is missing add it
    if (!fs.existsSync('./tmp/'))
      fs.mkdirSync('./tmp/')

    // Record the created tmp directory for clearing
    tmp_directory = fs.mkdtempSync('./tmp/');

    // Get files in /src directory
    let src_files = fs.readdirSync(`.${Path.sep}src`);
    traverseFiles(src_files, `.${Path.sep}src`, tmp_directory);
    console.log("ES6: Done compiling!")
    // Return the tmp directory so compiled files can be found
    return tmp_directory;
  };

  // Clear the temp files
  this.clear = (opts) => {
    removeTmpFiles(tmp_directory);
  };
}

// Traverse the passed files, determine if file or directory.
// If file then trasform, else traverse files in directory
//   Files: the list of files in a directory
//   The path of the directory
//   The tmp directory to place trasformed files in
function traverseFiles(files, path, tmp) {
  // Loop through files
  files.forEach((file) => {
    // The full path of the file
    let full_path = `${path}${Path.sep}${file}`;
    // Stat the file to see if directory or file
    let stat = fs.statSync(full_path);
    if (stat.isDirectory()) {
      // Get the new files of the directory
      let new_files = fs.readdirSync(full_path);
      // New temporary directory for files in this directory
      let new_tmp = `${tmp}${Path.sep}${file}`;
      traverseFiles(new_files, full_path, new_tmp);
    }
    else if (stat.isFile()){
      // transform file
      transformFile(file, path, tmp);
    }
  });
}

// Compile the ES6 file
function transformFile(file, path, tmp) {
  // Get the full path of the file
  let full_path = `${path}${Path.sep}${file}`;
  let code = Babel.transformFileSync(full_path,{}).code

  // If the tmp directory does not exist create it
  if (!fs.existsSync(tmp))
    fs.mkdirSync(tmp)

  // Build the tmp file path and write compiled code to file
  let tmp_file = `${tmp}${Path.sep}${file}`;
  fs.writeFileSync(tmp_file,code);
}

// Remove temp files
function removeTmpFiles(tmp) {
  // get the files in the topmost temp directory
  let files = fs.readdirSync(tmp);
  files.forEach((file) => {
    // Full path of file
    let full_path = `${tmp}${Path.sep}${file}`;
    // Stat to know if directory
    let stat = fs.statSync(full_path);
    if (stat.isDirectory()) {
      // Remove files in directory first
      removeTmpFiles(full_path);
    }
    else{
      // Remove file
      fs.unlinkSync(full_path);
    }
  });

  // Remove the directory
  if (fs.existsSync(tmp))
    fs.rmdirSync(tmp);
}

module.exports = ES6;
