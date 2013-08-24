var UserModel = require('../models/UserModel');

exports.checkProfile = function (req, res, next, onErrorRedirectTo) {
  req.checkBody('bio', 'The bio may not be greater than %2 characters')
     .len(0, 160);

  var formErrors = req.validationErrors(true) || {};

  // check avatar
  if (req.files.avatar && req.files.avatar.name) {
    var file = req.files.avatar;
    // mime type
    if( !~ ['image/jpeg', 'image/gif', 'image/png'].indexOf(file.type)) {
      formErrors.avatar = {
        param: 'avatar',
        msg: 'The avatar must be a file of type: jpeg, gif or png.',
        value: ''
      };
    }
    // size
    else if (file.size > 2000000) {
      formErrors.avatar = {
        param: 'avatar',
        msg: 'The avatar may not be greater than 2 Mo.',
        value: ''
      };
    }
  }
  if ( !! Object.keys(formErrors).length) { // invalid form data
    req.session.errors = formErrors;
    res.redirect(onErrorRedirectTo);
  }
  else  next(); // form is valid
}


exports.checkAccount = function (req, res, next, onErrorRedirectTo) {
  req.checkBody('username', 'The username may not be greater than %2 characters').len(1, 30);
  req.checkBody('username', 'The username may only contain letters, numbers, and dashes').is('[A-Za-z0-9_-]+');
  req.checkBody('username', 'This value should not be blank').notEmpty();
  req.checkBody('password', 'This value should not be blank').notEmpty();
  req.checkBody('password_confirmation', 'The confirmation and password must match').equals(req.body.password);

  var errors = req.validationErrors(true) || {};

  var fail = function () {
    req.session.errors = errors;
    res.redirect(onErrorRedirectTo);
  }

  if ( !! errors.username ) { // username invalid
    fail();
  }
  else {
    UserModel
      .findByName(req.body.username)
      .exec(function (err, user) {
        if (err) return next(err);
        if (user)  { // username already taken
          errors.username = {
            param: 'username',
            msg: 'This username has already been taken',
            value: req.body.username
          };
          fail();
        }
        else next(); // everything is ok
      });
  }
}