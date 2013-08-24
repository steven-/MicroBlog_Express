var async = require('async')
, fs = require('fs')
, im = require('imagemagick');


exports = module.exports = function (tmpPath, targetName, previousName, finalCallback) {

  var targetPath   = 'public/avatars/' + targetName
    , previousPath = 'public/avatars/' + previousName;

  async.waterfall([
      // Delete the previous avatar if there is one
      function (callback) {
        previousPath && fs.existsSync(previousPath)
            ? fs.unlink(previousPath, callback)
            : callback();
      },
      // Copy a thumbnail of the new one into the /avatars directory
      function (callback) {
        im.crop ({
            srcPath: tmpPath,
            dstPath: targetPath,
            width: 50,
            height: 50,
            quality: 1,
          },
          function (err, stdout, stderr) {
            callback(err);
          }
        );
      },
      // Delete the temporary file
      async.apply(fs.unlink, tmpPath)
    ],
    finalCallback
  );
}