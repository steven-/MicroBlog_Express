var MessageModel = require('../models/MessageModel');

exports.checkMessage = function (req, res, next, onErrorRedirectTo) {
  req.checkBody('message', 'The message may not be greater than %2 characters')
     .len(1, 140);
  req.checkBody('message', 'The message field is required').notEmpty();

  var errors = req.validationErrors(true);

  if ( !! errors) {
    req.session.errors = errors;
    res.redirect(onErrorRedirectTo);
  }
  else next();
}
