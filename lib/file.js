var path = require('path')
,   _ = require('lodash-node')
,   users = require('../json/data')
,   fs = require('fs-extra')
,   formidable = require('formidable');

exports.removeImages = function(req, imagePath, callback) {
  if(req && imagePath && callback) {
    fs.remove(imagePath, function (err) {
      if (err) throw err;
      callback();
    });
  } else {
    throw new Error('no req, imagePath or callback');
  }
}

exports.upload = function(req, imagePath, callback) {
  if(req && imagePath && callback) {
    var dat, form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      dat = fields;
    });
    form.on('end', function(fields, files) {
      if(dat.code) {
        var userInfo = _.find(users, function(user) { return user.code === dat.code; });
        if(userInfo) {
          var file = this.openedFiles[0],
            photoName = file.name;
          if(photoName) {
            var timestamp = + new Date();
            //   filePath = imagePath + '/photo' + timestamp + photoName;
            // fs.copy(file.path, '.' + filePath, function(err) {
            //   if (err) {
            //     callback({
            //       status: 'error',
            //       error: 'No photo'
            //     });
            //   } else {
                callback({
                  status: 'success',
                  dat: _.extend(dat, {id: userInfo.id, timestamp: timestamp})
                  // dat: _.extend(dat, {file: filePath, id: userInfo.id, timestamp: timestamp})
                });
            //   }
            // });
          } else {
            callback({
              status: 'error',
              error: 'No photo'
            });
          }
        } else {
          callback({
            status: 'error',
            error: 'Invaid code'
          });
        }
      } else {
        callback({
          status: 'error',
          error: 'No code'
        });
      }
    });
  } else {
    throw new Error('no req, imagePath or callback');
  }
};
