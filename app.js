
/**
 * App dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , expressValidator = require('express-validator')
  , filters = require('./lib/filters');

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
app.use(express.favicon());
app.use(express.static(path.join(__dirname, 'public')));


/* Middleware */
app.use(express.cookieParser('Microblog secret key'));
app.use(express.session());
app.use(express.bodyParser());
// app.use(express.csrf());


// @mytodo : filter app use validator only for post and puts routes
app.use(expressValidator());
app.use(express.methodOverride());
// app.use(app.router);

app.use(require('./lib/flashMessages')); // flash Messages

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());

  // app.use(function (req, res, next) {
  //       if (req.session.user) return next();

  //       var UserModel = require('./models/UserModel');
  //       UserModel.findOne({username: 'Abraham_Lincoln'}, function (err, user) {
  //           if (err) next(err);
  //           req.session.user = user;
  //           next();
  //       })
  //   });
}


// app.locals.errors = {};

app.use(function (req, res, next) {
  res.locals.errors = req.session.errors || {};
  // req.session.errors = null;
  res.locals.loggedUser = req.session.user || null;
  res.locals.csrf_token = req.session._csrf;
  res.locals.req = req; // for nav
  next();
});



// load controllers and register routes
require('./lib/boot')(app);




//  catch-all 404 handler
app.use(function (req, res, next) {
  console.log(req.url);
  next({msg: 'Not found', status: 404});
});





// // if ('development' !== app.get('env')) {
//   // error handler
//   app.use(function (err, req, res, next) {
//     console.log(err);
//     // we only send our customs error messages as a response
//     // (from 'err.msg') but not the 'error.message'
//     var errStatus = err.status || 500
//       , errMsg    = err.message || err.msg || "Something broke"; // dev
//       // , errMsg    = err.msg || "Something broke";


//       // respond with html
//       if (req.accepts('html')) {
//         res.statusCode = errStatus;
//         res.render('errors/error', {
//           status: errStatus,
//           message: errMsg
//         });
//         return;
//       }

//       // respond with json
//       if (req.accepts('json')) {
//         res.send(errStatus, errMsg);
//         return;
//       }

//       // default to plain-text
//       res.type('txt').send(errMsg);
//   });
// // }





http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
