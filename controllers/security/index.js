/* Security Controller */

var db = require('../../database')
	, pass = require('../../lib/pass')
  , UserModel = require('../../models/UserModel')
  , userForm  = require('../../forms/user-form');


  /**
   *
   *  SIGN IN (get)
   *
   */
exports.signIn = function (req, res) {
	res.render('security/sign-in');
}


/**
 *
 *  SIGN IN CHECK (post)
 *
 */
exports.signInCheck = function (req, res) {
	var username = req.body.username
	  , password = req.body.password;

  var fail = function () {
  	res.render('security/sign-in', {
  		signInFail: true,
  		username: username
  	});
  }

	UserModel
		.findByName(username)
		.exec(
			function(err, user) {
				if (err) return next(err);

				if ( ! user) { // invalid username
					fail();
				}
				else {
					pass.hash(password, user.salt, function(err, hash){
					   if (err) return next(err);

					   if (hash == user.password) { // authentication OK
		   	       // redirectOnceSignedIn ==> cf lib/boot.js in restrict middleware
					   	var redirectOnceSignedIn = req.session.redirectOnceSignedIn;
					   	req.session.regenerate(function(){
		   	        req.session.user = user;
		   					res.redirect(redirectOnceSignedIn || '/');
		   	      });
					   }
					   else fail(); // wrong password
					});
				}
			}
		);
}


/**
 *
 *  CREATE (get)
 *
 */
exports.create = function (req, res) {
	res.render('security/sign-up');
}


/**
 *
 *  STORE (post)
 *
 */
exports.preStore = function (req, res, next) {
	var onErrorRedirectTo = '/sign-up';
	userForm.checkAccount(req, res, next, onErrorRedirectTo);
}
//---------------------------------------
exports.store = function (req, res, next) {
	pass.hash(req.body.password, function(err, salt, hash){
	  if (err) return next(err);
	  UserModel.create({
	  		username: req.body.username,
	  		password: hash,
	  		salt: salt
	  	},
	  	function (err, user) {
	  		if (err) return next(err);
	  		req.session.user = user;
	  		res.redirect('/');
	  	}
	  );
	});
}



/**
 *
 *  SIGN OUT (get)
 *
 */
exports.signOut = function (req, res) {
	req.session.destroy(function(){
		res.redirect('/');
	});
}