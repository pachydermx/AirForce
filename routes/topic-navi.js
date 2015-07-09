/**
 * topic navi
 */
exports.selectTopic = function(req, res) {
  var topic = req.params.topic;
  var subtopic = req.params.subtopic;
  if (topic === undefined) {
    topic = 0;
    subtopic = 0;
  }
  if (subtopic === undefined) {
    subtopic = 0;
  }

  res.render('index', {topicIndex: topic, subtopicIndex: subtopic});
};