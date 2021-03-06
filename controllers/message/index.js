/* Message Controller */

var db = require('../../database')
, MessageModel = require('../../models/MessageModel')
, messageForm  = require('../../forms/message-form');


exports.restrictedActions = ['create', 'store', 'delete'];


/**
 *  LIST
 *
 */
exports.list = function (req, res) {
  MessageModel.findAllOrderedByDateDSCWithAuthor(function (err, messages) {
    if (err) return next(err);

    if (req.xhr) res.json(messages);
    else res.render('message/list', { messages: messages });
  });
};


/**
 *  CREATE
 *
 */
exports.create = function (req, res) {
  res.render('message/create');
};


/**
 *  STORE
 *
 */
exports.preStore = function (req, res, next) {
  var onErrorRedirectTo = '/new';
  messageForm.checkMessage(req, res, next, onErrorRedirectTo);
}
//-----------------------------------------------------
// @todo change _id vs id stuff
exports.store = function (req, res) {
  MessageModel.create({
      message: req.body.message,
      author: req.session.user._id || req.session.user.id
    },
    function (err) {
      if (err) return next(err);
      req.flashBag.add('success', 'Your message has been posted');
      res.redirect('/');
    }
  );
}


/**
 *  DELETE
 *
 */
// @todo change _id vs id stuff
exports.delete = function (req, res, next) {
    MessageModel.remove({
      _id : req.params.id,
      author: req.session.user._id || req.session.user.id
    },
    function (err, message) {
      if (err) return next(err);
      if ( ! message) return next({
        msg: 'You are not the author of this message',
        status: 403
      });
      req.flashBag.add('info', 'Your message has been deleted');
      res.redirect(req.headers['referer'] || '/');
    }
  );
}