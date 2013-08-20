var fs = require('fs');


// middleware for routes who ask for an authenticated user
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.redirectOnceSignedIn = req.url;
    res.redirect('/sign-in');
  }
}


module.exports = function(app){

  var controllers = {};

  fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
    var obj = require('./../controllers/' + name);
    controllers[name] = obj;
  });


  var map = function(routes){
    for (var uri in routes) {
      var route = routes[uri];

      for (var method in route) {
        var params = route[method].split('.')
          , ctrlName = params[0]
          , callbackName = params[1]
          , ctrl = controllers[ctrlName] || []
          , callback = ctrl[callbackName];

        if( ! callback) {
          console.log(ctrlName + '.' + callbackName, 'method does not exist');
          continue;
        }

        var middlewares = undefined
          , optionalMiddlewareKey = 'pre' + callbackName.charAt(0).toUpperCase() + callbackName.slice(1);

        // can be a function or an array of functions
        if (ctrl[optionalMiddlewareKey]) { middlewares = ctrl[optionalMiddlewareKey] }


        if (ctrl.restrictedActions && ~ ctrl.restrictedActions.indexOf(callbackName)) {
          switch(typeof middlewares) {
            case 'Object': // Array
              middlewares.unshift(restrict)
              break;
            case 'function':
              middlewares = [restrict, middlewares]
              break;
            case 'undefined':
              middlewares = restrict;
              break;
          }
        }

        if (middlewares) {
          app[method](uri, middlewares, callback)
        }
        else {
          app[method](uri, callback);
        }
      }
    }
  };

  var routes = require('./routes');
  map(routes);
};