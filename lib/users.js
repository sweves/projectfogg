var path = require('path')
,   _ = require('lodash-node')
,   users = require('../json/data');

exports.get = function() {
  return this.removeCode(users);
};

exports.find = function(id) {
  return _.find(users, function(user) { return user.id === id; });
};

exports.removeCode = function(arr) {
  if(_.isArray(arr)) {
    return _.map(arr, function(user) {
      return _.omit(user, 'code');
    });
  } else {
    throw new Error('Not Array');
  }
};