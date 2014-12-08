var _ = require('lodash-node')
,   colors = require('colors')
,   config = require('../json/config').db
,   mongodb = require('mongodb')
,   MongoClient = mongodb.MongoClient
,   ObjectId = mongodb.ObjectID
,   db
,   users;

exports.close = function(callback) {
  if(db) {
    db.close();
    if(callback) callback();
  } else {
    throw new Error('No db');
  }
};

exports.insert = function(dat, callback) {
  if(users) {
    users.insert(dat, function(err, result) {
      if (err) throw new Error(err);
      else if(callback) callback(result);
    });
  } else {
    throw new Error('No users');
  }
};

exports.remove = function(query, callback) {
  if(users) {
    users.remove(query, function(err, results) {
      if (err) throw new Error(err);
      else if(callback) callback(results);
    });
  } else {
    throw new Error('No users');
  }
};

exports.removeById = function(id, callback) {
  if(users) {
    try {
      users.remove({_id: ObjectId(id)}, function(err, results) {
        if (err) throw new Error(err);
        else if(callback) callback(results);
      });
    } catch(err) {
      console.error(err);
      if(callback) callback([]);
    }
  } else {
    throw new Error('No users');
  }
};

exports.removeAll = function(callback) {
  if(users) {
    users.remove({}, function(err, results) {
      if (err) throw new Error(err);
      else if(callback) callback(results);
    });
  } else {
    throw new Error('No users');
  }
};

exports.find = function(query, callback) {
  if(users) {
    users.find(query).toArray(function(err, results) {
      if (err) throw new Error(err);
      else if(callback) callback(results);
  });
  } else {
    throw new Error('No users');
  }
};

exports.findAll = function(callback) {
  if(users) {
    users.find({}).toArray(function(err, results) {
      if (err) throw new Error(err);
      else if(callback) callback(results);
  });
  } else {
    throw new Error('No users');
  }
};

exports.connect = function(prod, callback) {
  var url = prod? config.production : config.dev;
  MongoClient.connect(url, function(err, database) {
    if (err) throw new Error(err);
    else {
      db = database;
      users = db.collection('users');
      console.log(('Connected correctly to server:' + url).green);
      if(callback) callback();
    }
  });
};

