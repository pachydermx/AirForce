/**
 * ViewModel (as defined in 'Model View ViewModel (MVVM)')
 * The use of knockout.js (http://knockoutjs.com) is assumed.
 *  
 * @constructor
 * @param url to get the data file
 * @param opts (optional) {topic: topic, subtopic: subtopic} to override the cookie's value
 * @param callback the function to be called after the constructor finishes.
 */
function Exp3ViewModel(url, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  var model = this;
  // to prevent multiple application of bindings
  this.hasApplied = false;
  
  this.currentTopic = ko.observable();
  this.subtopics = ko.observableArray();
  this.currentSubtopic = ko.observable();
  this.answerLink = ko.observable();
  this.codeTemplates = ko.observableArray();
  this.currentCodeTemplateIndex = ko.observable();
  
  $.ajax({
    url: '/userid'
  }).done(function(data) {
    model.userid = data;
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json'
    }).done(function(data) {
      model.title = data.title;
      model.subtitle = data.subtitle;
      model.year = data.year;
      model.labels = data.labels;
      model.cssLabels = data.cssLabels;
      model.topics = data.topics;
      
      var topicIndex = opts.topic || model.getCookie('topic') || 0;
      var subtopicIndex = opts.subtopic || model.getCookie('subtopic') || 0;
      if (opts.selectTopic != false) {
        model.selectTopic(topicIndex, subtopicIndex);
        model.setupAssignmentUrls();
      }
      callback();
    }).fail(function() {
      console.log('ViewModel cannot be initiazlied');
    });
  }).fail(function() {
    console.log('ICS_LAB_USERID cannot be obtained');
  });
}

/**
 * Select the topic
 * @param topicIndex
 * @param subtopicIndex
 * @param pushState (optional)
 */
Exp3ViewModel.prototype.selectTopic = function(topicIndex, subtopicIndex, pushState) {
  //console.log('selectTopic ' + topicIndex + ', ' + subtopicIndex + ', ' + pushState)
  var model = this;
  // check if the cookie's values are valid
  topicIndex = Number(topicIndex);
  if (isNaN(topicIndex) || topicIndex < 0 || topicIndex >= model.topics.length) {
    // reset the index
    topicIndex = 0;
    // and subtopicIndex
    subtopicIndex = 0;
  }
  var topic = model.topics[topicIndex];
  model.currentTopic(topic);
  model.subtopics(topic.subtopics);
  model.setCookie({topic: topicIndex});

  model.selectSubtopic(subtopicIndex, pushState);
};

Exp3ViewModel.prototype.selectSubtopic = function(subtopicIndex, pushState) {
  var model = this;
  // check the index
  var subtopics = model.subtopics();
  subtopicIndex = Number(subtopicIndex);
  if (isNaN(subtopicIndex) || subtopicIndex < 0 || subtopicIndex >= subtopics.length) {
    subtopicIndex = 0;
    // should we reset topicIndex if subtopicIndex is not valid?
  }
  // get the subtopic from the model 
  var subtopic = model.subtopics()[subtopicIndex];
  model.currentSubtopic(subtopic);
  model.setCookie({subtopic: subtopicIndex});
  model.updateSubtopicText();
  model.updateCodeTemplate();
  // get the current topic's index
  var topicIndex = model.topics.indexOf(model.currentTopic()); 
  if (topicIndex < 0) {
    console.log('selectSubtopic: incorrect topicIndex ' + topicIndex);
    topicIndex = 0; // reset to zero
  }
  // use the pushState/popState feature introduced in HTML5
  var state = {topic: topicIndex, subtopic: subtopicIndex};
  var url = '/topic/' + topicIndex + '/' + subtopicIndex;
  if (pushState) {
    history.pushState(state, document.title, url);
  } else {
    history.replaceState(state, document.title, url); 
  }
};

/**
 * Update the code template pane
 */
Exp3ViewModel.prototype.updateCodeTemplate = function() {
  var model = this;
  var name = model.currentSubtopic().name;
  if (name) {
    // get a file list
    $.ajax({
      url: '/templates/' + name,
      dataType: 'json'
    }).done(function(obj) {
      function flatten(list) {
        return list.map(function(item) {
          if (typeof item == 'string') {
            // exclude the file which does not end with '.html' or '.js' or '.css'
            var index = item.lastIndexOf('.');
            var ext = item.substring(index + 1);
            if ((ext == 'html') || (ext == 'js') || (ext == '.css')) {
              return item;
            } else {
              return [];
            }
          } else {
            for (var name in item) {
              // we assume there is only one name
              return flatten(item[name]).map(function (x) {
                return name + '/' + x;
              });
            }
          }
        }).reduce(function(x, y) {
          return x.concat(y);
        }, []);
      }
      var list = flatten(obj[name]).sort(function(x, y) {
        // in order to make 'html' come first, then js followed by other types.
        function tempname(name) {
          var index = name.lastIndexOf('.');
          var ext = name.substring(index + 1);
          var prefix = (ext === 'html') ? '0' : ((ext === 'js') ? '1' : '2');
          return prefix + name;
        }
        x = tempname(x);
        y = tempname(y);
        if (x > y) {
          return 1;
        } else if (x < y) {
          return -1;
        } else {
          return 0;
        }
      });
      model.codeTemplates(list);
      // just click the first one
      model.selectCodeTemplate(0);
    }).fail(function(response) {
      console.log(response.responseText);
      $('#sample-code').html(response.responseText);
    });
  } else {
    // not an exercise
    $('#sample-code').empty();
  }
};

/**
 * Selects a code template
 * @param index
 */
Exp3ViewModel.prototype.selectCodeTemplate = function(index) {
  var model = this;
  var name = model.currentSubtopic().name;
  var files = model.codeTemplates();
  if (files.length > index) {
    model.currentCodeTemplateIndex(index);
    var file = files[index];
    var ext = file.substring(file.lastIndexOf('.') + 1);
    $.ajax({
      url: '/templates/' + name + '/' + file,
      dataType: 'text'
    }).done(function(data) {
      // use the syntaxhighliter to hilight the code
      var code = $('<script type="syntaxhighlighter" class="brush: ' + ext + '"></script>');
      code.text('<![CDATA[' + data + ']]>');
      $('#sample-code').empty();
      $('#sample-code').append(code);
      SyntaxHighlighter.highlight();
      /*// hilight.js 
      var code = $('<pre><code/></pre>').text(data).each(function(i, e) {
        hljs.highlightBlock(e);
      });
      $('#sample-code').append(code);
      */
    }).fail(function(response) {
      $('#sample-code').html(reponse.responseText);
    });
  } else {
    $('#sample-code').empty();
  }
};

/**
 * Updates the subtopic text area
 */
Exp3ViewModel.prototype.updateSubtopicText = function() {
  var model = this;
  var textfile = model.currentSubtopic().text;
  if (!textfile) {
    // if the file name  is not specified, we assume md (markdown)
    var name = model.currentSubtopic().name;
    textfile = '/texts/' + name + '.md';
  } else {
    textfile = '/texts/' + textfile;
  }
  if (textfile != undefined) {
    $.ajax({
      url: textfile,
      dataType: 'text'
    }).done(function(data) {
      var index = textfile.lastIndexOf('.');
      var ext = textfile.substring(index + 1);
      //console.log(ext)
      if (ext == 'md') {
        // markdown
        data = marked(data); 
      }
      var $dom = $('<div>' + data + '</div>');

      if (model.hasApplied) {
        // if the model has already been applied, apply binding here
        // otherwise, applyBindings will be done later
        ko.applyBindings(model, $dom[0]);
      }
      $('#subtopic-text :only-child').replaceWith($dom);
    }).fail(function(response) {
      $('#subtopic-text').empty();
      $('#subtopic-text').append('<p style="color: red">' + response.responseText + '</p>');
    }).always(function() {
    });
  } else {
    $('#subtopic-text').empty();
    $('#subtopic-text').append('<p style="color: red">textfile not found!</p>');
  }
};

/**
 * Returns a url of a current subtopic
 * @returns {String}
 */
Exp3ViewModel.prototype.getExampleUrl = function() {
  var model = this;
  var name = model.currentSubtopic().name;
  if (name) {
    return '/answers/' + name + '/' + name + '.html';
  }
};

/**
 * Set the cookie according to the param data
 * @param data
 */
Exp3ViewModel.prototype.setCookie = function(data) {
  // expires in a day
  var expires = 1 * 24 * 60 * 60 * 1000;
  for (var name in data) {
    document.cookie = name + '=' + data[name] + '; path=/; expires=' 
      + new Date(new Date().getTime() + expires).toGMTString();
  }
  // cookie expires when a session ends.
  //for (var name in data) {
  //  document.cookie = name + '=' + data[name];
  //}
};


/**
 * Get the value of the cookie
 * @param name 
 * @returns 
 */
Exp3ViewModel.prototype.getCookie = function(name) {
  if (document.cookie) {
    cookies = document.cookie.split('; ');
    for (var i = 0; i < cookies.length; i++) {
      var namevalue = cookies[i].split('=');
      if (namevalue[0] == name) {
        return namevalue[1];
      }
    }
  }
  return null;
};

Exp3ViewModel.prototype.setupAssignmentUrls = function() {
  var model = this;
  model.assignmentUrls = model.topics.map(function(topic) {
    var prefix = '/' + model.userid + (topic.prefix || '');
    var subtopics = topic.subtopics;
    if (subtopics) {
      for (var i = 0; i < subtopics.length; i++) {
        if (subtopics[i].type === 'assignment') {
          return prefix + '/' + subtopics[i].name + '.html';
        }
      }
      return null;
    } else {
      return null;
    }
  });
};
