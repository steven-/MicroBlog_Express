/******************************************************************************/
/*                            MESSAGE MODEL                                   */
/******************************************************************************/



/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
require('./UserModel');


/*----------------------------------------------------------------------------*/
/*                                SCHEMA                                      */

/**
 * Schema definition
 *
 */
var messageSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.ObjectId, ref: 'User' },
    message: String,
    created_at: { type: Date, default: Date.now }
});



/*----------------------------------------------------------------------------*/
/*                                METHODS                                     */


//-----------------------
// Static methods:
//----------------------


/**
 * Find all messages ordered by date DESC, and populate each messages
 * with their author.
 *
 * @param {Function} callback
 */
messageSchema.statics.findAllOrderedByDateDSCWithAuthor = function (callback) {
  this.find()
      .populate('author')
      .sort({created_at: -1})
      .exec(callback);
}



/**
 * Find all messages by a specific user
 *
 * @param {Object} authorId     (ids are objects in Mongoose : ObjectId)
 * @param {Function} callback
 */
messageSchema.statics.findByAuthor = function (authorId, callback) {
    this.find()
        .where('author').equals(authorId)
        .sort({ created_at: -1 })
        .exec(callback);
}



exports = module.exports = mongoose.model('Message', messageSchema);
