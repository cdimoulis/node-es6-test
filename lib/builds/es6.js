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
  // done: callback function when complete
  //      err: any errors
  //      tmp_folder: The temporary folder created to hold the transformed files
  this.build = (done) => {
    if (!done || (typeof done) != 'function')
      throw new TypeError('"done" option must be a function');
    // Build the tmp folder
    buildFolder('./tmp/', (err) => {
      if (err)
        finish(err);
      else
        tempFolder();
    });

    // Function managing the temp folder build
    function tempFolder() {
      buildTempFolder( (err, folder) => {
        if (err)
          finish(err);
        else {
          tmp_directory = folder;
          readSrc();
        }
      });
    };

    // Function managing the reading of files and beginning the traversal
    function readSrc() {
      fs.readdir(`.${Path.sep}src`, (err, files) => {
        if (err)
          finish(err);
        else {
          try {
            traverseFiles(files, `.${Path.sep}src`, tmp_directory);
          }
          catch (e) {
            err = e;
          }
          finish(err);
        }
      });
    };

    // Function handling the finish
    function finish(err) {
      done(err, tmp_directory);
    }

  };

  // Clear the temp files
  this.clear = (opts) => {
    removeTmpFiles(tmp_directory);
  };

  /****
  * Private Functions
  *****/

  // Create any folder if it does not exist
  // folder: name of folder
  // complete: callback when complete
  //         err: returned to callback if error occurs
  var buildFolder = (folder, complete) => {
    // If folder is missing add it
    fs.access(folder,(err) => {
      // IF err then missing so add
      if (err) {
        fs.mkdir(folder, (err) => {
          if (err) {
            complete(err);
          }
          else {
            complete();
          }
        });
      }
      else {
        complete();
      }
    });
  };

  // Create a random temp folder
  // complete: callback when complete
  //          err: returned to callback if error occurs
  //          folder: the folder name that is created
  var buildTempFolder = (complete) => {
    fs.mkdtemp('./tmp/', (err, folder) => {
      if (err) {
        complete(err);
      }
      else {
        complete(err, folder);
      }
    });
  };

  // Traverse the passed files, determine if file or directory.
  // If file then trasform, else traverse files in directory
  //   Files: the list of files in a directory
  //   The path of the directory
  //   The tmp directory to place trasformed files in
  var traverseFiles = (files, path, tmp) => {
    // Loop through files
    files.forEach((file) => {
      // The full path of the file
      let stat, full_path = `${path}${Path.sep}${file}`;
      // Stat the file to see if directory or file
      stat = fs.statSync(full_path);
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
  };
  
  // Compile the ES6 file
  var transformFile = (file, path, tmp) => {
    // Get the full path of the file
    let full_path = `${path}${Path.sep}${file}`;
    let code = Babel.transformFileSync(full_path,{}).code

    // If the tmp directory does not exist create it
    if (!fs.existsSync(tmp))
      fs.mkdirSync(tmp)

    // Build the tmp file path and write compiled code to file
    let tmp_file = `${tmp}${Path.sep}${file}`;
    fs.writeFileSync(tmp_file,code);
  };

  // Remove temp files
  var removeTmpFiles = (tmp) => {
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
  };
}

module.exports = ES6;
