/**
 * Create a zip file
 * 
 * requires node-zip > 1.1.0
 */
var node_zip = new require('node-zip');
var fs = require('fs');
var async = require('async');

var root_directory = '';

exports.setRootDir = function(dir) {
  root_directory = dir;
};

function addFileToZip(zip, relpath, path, callback) {
  //console.log('> addFileToZip: ' + path);
  fs.stat(path, function(err, stats) {
    //console.log('  addFileToZip (stat)' + stats);
    if (err) {throw err;}
    fs.readFile(path, function(err, buffer) {
      zip.file(relpath, buffer, {binary: false, date: stats.mtime});
      //console.log('  addFileToZip (read)' + stats);
      callback(err);
    });
  });
  //console.log('< addFileToZip: ' + path);
}

function addToZip(zip, relpath, path, callback) {
  //console.log('> AddToZip: ' + path);
  fs.stat(path, function(err, stats) {
    if (err) {throw err;}
    if (stats.isFile()) {
      addFileToZip(zip, relpath, path, callback);
    } else if (stats.isDirectory()) {
      zip.folder(relpath);
      fs.readdir(path, function(err, files) {
        if (err) {throw err;}
        //console.log(files);
        async.each(files, function(file, callback) {
          addToZip(zip, relpath + '/' + file, path + '/' + file, callback);
          //console.log(file);
        }, callback);
      });
    }
  });
  //console.log('< AddToZip: ' + path);
}

exports.createZip = function(req, res){
  
  var dirname = req.params.dirname;
  var zip = new node_zip();
  addToZip(zip, dirname, root_directory + dirname, function(err) {
    if (err) {
      console.log(err.message);
      res.setHeader('Content-disposition', 'attachment; filename=err.txt');
      res.setHeader('Content-type', 'plain/text');
      res.end(err.message);
    } else {
      var data = zip.generate({type:'nodebuffer', compression:'DEFLATE'});
      res.setHeader('Content-disposition', 'attachment; filename=' + dirname + '.zip');
      res.setHeader('Content-type', 'application/zip');
      res.end(data);
    }
  });
};