var MessageModel = require('../models/MessageModel');

exports.checkMessage = function (req, res, next) {
  req.checkBody('message', 'The message may not be greater than %2 characters')
     .len(1, 140);
  req.checkBody('message', 'The message field is required').notEmpty();
  next();
}
