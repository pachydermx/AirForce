/**
 * ICS_LAB exp3 2015 version
 */
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

app.set('port', process.env.PORT || 3000);
// 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// to allow an access to a student's directory by its directory name
app.use(express.static(path.join(__dirname, '')));
// to follow the convention of express
app.use(express.static(path.join(__dirname, 'public')));

// since we make the root directory public (to allow a student's
// directory visible), we try to hide files only used by the server
function return404(req, res) {
  res.send(404);
}
app.get('/app.js', return404);
app.get('/routes/*', return404);
app.get('/public/*', return404);

// to allow directly going to a particular topic/subtopic
var topicNavi = require('./routes/topic-navi');
app.get('/topic/:topic', topicNavi.selectTopic);
app.get('/topic/:topic/:subtopic', topicNavi.selectTopic);
// the access to the root will reroute to this navi 
app.get('/', topicNavi.selectTopic);

// create a zip file
var createZip = require('./routes/create-zip');
app.get('/createzip/:dirname', createZip.createZip);

// to provide the userID
var getUserid = require('./routes/get-userid');
app.get('/userid', getUserid.userid);

// to provide a list of template files
var templateListing = require('./routes/template-listing');
app.get('/templates/:name', templateListing.listAll);

// for admin functions
// skip admin if ICS_LAB_HOME is set (i.e. used in the student mode)
/*
if (process.env.ICS_LAB_HOME === undefined) {
  var admin = require('./routes/admin');
  admin.init();
  app.post('/admin/:command/:param', admin.handleCommand);
}
*/

//REST API example
//'one-line' bbs (in memory version)
var bbs = require('./routes/bbs');
app.get('/bbs', bbs.listAll);
app.get('/bbs/:id', bbs.getById);
app.post('/bbs', bbs.addMessage);
app.put('/bbs/:id', bbs.updateMessage);
app.delete('/bbs/:id', bbs.deleteMessage);
// just for debug
app.delete('/bbs', bbs.deleteAllMessages);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// This error handler will print stacktrace
//  not recommended for production use.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

var debug = require('debug')('exp3');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

// WebSocket server
// simple chat server implementation
var WebSocketServer = require('websocket').server;
var wsServer = new WebSocketServer({
  httpServer: server
});

var connections = [];
var commands = [];

wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  connections.push(connection);
  console.log('Connected: ' + connection.remoteAddress 
      + ' (' + connections.length + ')');
  
  function broadcast(data) {
    connections.forEach(function(destination) {
      /*
      if (destination === connection) {
        console.log("sending to itself");
      }
      */
      destination.sendUTF(JSON.stringify(data));
    });
  }
  
  // when a connection is made, commands sent so far will be sent 
  commands.forEach(function(command) {
    connection.sendUTF(JSON.stringify(command));
  });
  
  connection.on('message', function(message) {
    // message ::= {type: 'utf8', utf8Data: '{....}'}
    var jsonMsg = JSON.parse(message.utf8Data);
    console.log('Received from ' + connection.remoteAddress 
        + ' ' + message.utf8Data);
    if (jsonMsg.type === 'clearAll') {
      commands = [];
      console.log('commands are reset');
    } else {
      commands.push(jsonMsg);
    }
    broadcast(jsonMsg);
  });
  
  connection.on('close', function() {
    console.log('disconnected: ' + connection.remoteAddress);
    var index = connections.indexOf(connection);
    if (index != -1) {
      connections.splice(index, 1);
    }
  });
});
