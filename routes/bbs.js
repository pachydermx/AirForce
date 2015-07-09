/**
 * simple bbs
 * 
 * message should have the following properties:
 *  _id - message id (used as an index following the convention of MongoDB)
 *  date - the date of message (used to sort the messages)
 */
var messages = {
    nextId: 0,
    data: {}
};

function addMessage(message) {
  var id = messages.nextId;
  message._id = id;
  
  messages.nextId = id + 1;
  messages.data[id] = message;
}

exports.listAll = function(req, res) {
  var results = [];
  for (var id in messages.data) {
    results.push(messages.data[id]);
  }
  // sort messages by date
  results = results.sort(function(x, y) { return y.date - x.date;});
  res.json(results);
};

exports.getById = function(req, res) {
  var id = req.params.id;
  var message = messages.data[id];
  if (message == undefined) {
    res.send(404); //not found
  } else {
    res.json(message);
  }
};

exports.addMessage = function(req, res) {
  var message = req.body;
  addMessage(message);
  var id = message._id.toString();
  console.log('adding a message ' + JSON.stringify(message) + ' (id =' + id);
  res.status(201).location('bbs/' + id);
  res.send();
};

exports.updateMessage = function(req, res) {
  var message = req.body;
  console.log('updating a message ' + JSON.stringify(message));
  var id = message._id;
  if (messages.data[id] == undefined) {
    // no existing data
    res.send(404);
  } else {
    messages.data[id] = message;
    res.send(204);
  }
};

exports.deleteMessage = function(req, res) {
  var id = req.params.id;
  console.log('deleting a message ' + id);
  var message = messages.data[id];
  if (message == undefined) {
    // does not exist
    res.send(404);
  } else {
    delete messages.data[id];
    res.send(204);
  }
};

exports.deleteAllMessages = function(req, res) {
  console.log('deleting all messages');
  reset();
  res.send(204);
};

function populateSamples() {
  var now = new Date().getTime();
  var messages = [
                  {
                    name: '立命 太郎',
                    date: new Date(now).getTime(),
                    body: 'おはよう'
                  },
                  {
                    name: '衣笠 花子',
                    date: new Date(now + 1000).getTime(),
                    body: 'こんにちは'
                  },
                  {
                    name: '大阪 次郎',
                    date: new Date(now + 2000).getTime(),
                    body: 'こんばんは'
                  }
                  ];
  messages.forEach(function(message) {
    addMessage(message);
  });
}

function reset() {
  messages.nextId = 0;
  messages.data = {};
}

// initialize now
reset();
// add example messages if necessary
//populateSamples();