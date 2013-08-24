/******************************************************************************/
/*                               USER MODEL                                   */
/******************************************************************************/

/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , uploadAvatar = require('../lib/upload-avatar');



/*----------------------------------------------------------------------------*/
/*                                SCHEMA                                      */

/**
 * Schema definition
 */
var userSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    avatar: String,
    bio: String
  },
   { strict: true }  // <-- Default option (only the properties defined in
                    //      the schema can be saved into the database)
);


// When user.toJSON() is called, we don't want some properties in the returned
// object (i.e. no salt & password for client side).
// user.toJSON is triggered for JSON responses ( res.json({Object}) )
if ( ! userSchema.options.toJSON) userSchema.options.toJSON = {};
userSchema.options.toJSON.transform = function (doc, returnedUser, options) {
  returnedUser.id = doc._id;
  delete returnedUser._id;
  delete returnedUser.__v;
  delete returnedUser.salt;
  delete returnedUser.password;
}

/*----------------------------------------------------------------------------*/
/*                                METHODS                                     */


//-----------------------
// Static methods:
//----------------------


/**
 * Get the user that matchs the given username
 * and execute callback(err {Object}, user {Object|null})
 *
 * @param {String} username
 * @param {Function} callback
 */
userSchema.statics.findByName = function (username, callback) {
  var statement = this.findOne({ username: new RegExp(username, 'i') });
  if (callback) {
    return statement.exec(callback);
  }
  else return statement;
}

/**
 * Get a list of all users orderered by ascending username
 * and execute callback(err {Object}, users {Array})
 *
 * @param {Function} callback
 */
userSchema.statics.findAllOrderedByNameASC = function (callback) {
  this.find()
      .sort({username: 1})
      .exec(callback);
}



//-------------------------
// Instances method:
//-------------------------

/**
 * Set a 'req.files' object to a User model instance.
 * The method checks if the instance has already an avatar ({String} file name)
 * and eventually saves the value in a 'previousFileName' propertie.
 *
 * @param {Object} uploadedFile
 */
userSchema.methods.setUploadedFile = function (uploadedFile) {
  this.uploadedFile = uploadedFile;
  if (this.avatar) {
    this.previousFileName = this._id + '.' + this.avatar;
  }
}


/*----------------------------------------------------------------------------*/
/*                             MIDDLEWARE                                     */



userSchema.pre('save', function (next, callback) {
  var self = this;

  if (this.uploadedFile) {
    this.avatar = self.uploadedFile.avatar.name
                                          .split('.')
                                          .pop()
                                          .toLowerCase();
  }

  next(function (err, user) { // <-- callback of the user.save method
    // We upload the new avatar AFTER the user has been saved to the db
    // (there might have an error with user.save()).
    // Since we need to wait for the avatar to be moved and resized before
    // sending a response to the browser (where we'll need the new avatar),
    // we can't use Mongoose 'post' middleware to perform these operations.
    // Instead, we use the callback of the save method (this function) to call
    // the upload function with the original callback as parameter.

    if (err) return callback(err);

    if (self.uploadedFile) {
      var tmpPath = self.uploadedFile.avatar.path
        , targetName = self._id + '.' + self.avatar;

      uploadAvatar(tmpPath, targetName, self.previousFileName, function (err) {
        callback(err, user);
      });
    }
    else callback(null, user);
  });
});

/*----------------------------------------------------------------------------*/

module.exports = mongoose.model('User', userSchema);



