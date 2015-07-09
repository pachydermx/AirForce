/*
 * GET user id
 */
exports.userid = function(req, res) {
  if (process.env.ICS_LAB_HOME === undefined) {
    // development mode
    res.end('is0243kv');
  } else {
    if (process.env.ICS_LAB_USERID) {
      res.end(process.env.ICS_LAB_USERID);
    } else {
      res.send(500, 'ICS_LAB_USERID is not defined');
    }
  }
};
