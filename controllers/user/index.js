/******************************************************************************/
/*                            USER CONTROLLER                                 */
/******************************************************************************/

// require modules
var db = require('../../database')
  , MessageModel = require('../../models/MessageModel')
  , UserModel = require('../../models/UserModel')
  , userForm  = require('../../forms/user-form');


exports.restrictedActions = ['edit', 'update'];


/**
 *  LIST
 *
 */
exports.list = function(req, res, next){
  UserModel.findAllOrderedByNameASC(function (err, users) {
    if (err) throw err;
    res.render('user/list', { users: users });
  });
}


/**
 *  SHOW
 *
 */
exports.show = function(req, res, next){
  UserModel.findByName(
    req.param('username'),
    function (err, user) {
      if (err) throw err;
      if ( ! user) return next({ msg: 'User not found', status: 404 });

      MessageModel.findByAuthor(user._id, function (err, messages) {
        if (err) next(err);
        else res.render('user/show', { user: user, messages: messages });
      });
    }
  );
}


/**
 *   EDIT (get)
 *
 */
exports.edit = function (req, res, next) {
  res.render('user/edit', { user: req.session.user });
}


/**
 *
 *  UPDATE (post)
 */
exports.preUpdate = userForm.checkProfile;
 //---------------------------------------
exports.update = function (req, res, next) {

  var errors = req.validationErrors(true);

  if (errors) {
    res.render('user/edit', {
      errors: errors,
      user: req.session.user
    });
  }
  else {
    UserModel.findByName(
      req.session.user.username,
      function (err , user) {
        if (err) return next(err);

        user.bio = req.body.bio;
        req.files.avatar.name && user.setUploadedFile(req.files);
        user.save(function (err, user) {
          if (err) throw err;
          req.session.user = user; // stores user.toJSON() result
          res.redirect('/profile/' + user.username );
        });
      }
    );
  }
}