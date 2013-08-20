
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/microblog_express');
var db = mongoose.connection;

module.exports = db;