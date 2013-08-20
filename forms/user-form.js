var UserModel = require('../models/UserModel');

exports.checkProfile = function (req, res, next) {
  console.log('check the profile');
  req.checkBody('bio', 'The bio may not be greater than %2 characters')
     .len(0, 160);
  next();
}


exports.checkAccount = function (req, res, next) {
  req.checkBody('username', 'The username may not be greater than %2 characters').len(1, 30);
  req.checkBody('username', 'The username may only contain letters, numbers, and dashes').is('[A-Za-z0-9_-]+');
  req.checkBody('username', 'This value should not be blank').notEmpty();
  req.checkBody('password', 'This value should not be blank').notEmpty();
  req.checkBody('password_confirmation', 'The confirmation and password must match').equals(req.body.password);

  var errors = req.validationErrors(true);

  if (errors && errors.username ) { // username invalid
    next();
  }
  else {
    UserModel
      .findByName(req.body.username)
      .exec(function (err, user) {
        if (err) return next(err);
        if (user)  { // username already taken
          console.log('already');
          errors = req.validationErrors(false); // we don't use the 'errors' var, we need another format
          errors.push({
            param: 'username',
            msg: 'This username has already been taken',
            value: req.body.username
          });

          // it's a bit tricky since it's a 'private' var of the express-validator module
          req._validationErrors = errors;
        }
        next();
      });
  }
}