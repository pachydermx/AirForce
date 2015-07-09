/**
 * get a file list of the subtopic under the templates directory
 */
// we use the fs-extra
var fse = require('fs-extra');
var async = require('async');

// results ::= file  (if file is not a directory)
//             {file : [....] }
// callback(err, results)
// results is 'name' (if 'name' is a file)
//            {'name' : [...]} (if 'name' is a directory)
function getFileList(parent, name, callback) {
  fse.stat(parent + '/' + name, function(err, stats) {
    if (err) { 
      callback(err, null); 
    } else if (stats.isFile()) {
      // if this is a file, return it
      callback(null, name);
    } else if (stats.isDirectory()) {
      var path = parent + '/' + name;
      fse.readdir(path, function(err, files) {
        if (err) { 
          callback (err, null); 
        } else {
          async.map(files, function(file, cb) {
            getFileList(path, file, cb);
          }, function(err, results) {
            var result = {};
            result[name] = results;
            callback(err, result);
          });
        }
      });
    } else {
      // ??
      callback(true, null);
    }
  });
}

exports.listAll = function(req, res) {
  var name = req.params.name;
  //var dir = 'templates/' + name;
  getFileList('public/templates', name, function(err, results) {
    console.log(results);
    if (err) {
      console.log(err);
      res.send(404);
    }
    res.send(results);
  });
};