var path = require('path')
,   fs = require('fs')
,   argv = require('yargs').argv
,   colors = require('colors')
,   express = require('express')
,   exphbs = require('express-handlebars')
,   bodyParser = require('body-parser')
,   app = express()
,   http = require('http')
,   _ = require('lodash-node')
,   lib = require('./lib')
,   pckg = require('./package')
,   config = require('./json/config')
,   data = require('./json/data')
,   port = process.env.PORT || config.port
,   jsonPath = '/json'
,   imagePath = '/uploads'
,   publicPath = '/public'
,   adminPath = '/admin'
,   rootPath = '/'
,   version = pckg.version;

/**************************************
 * DB
 **************************************/
lib.db.connect(argv.production, function() {
  var server = http.createServer(app);
  server.listen(port);
  console.log('Listening on ' + port);
});

/**************************************
 * Authentication
 **************************************/
app.use(function(req, res, next) {
  if(req.originalUrl.indexOf(adminPath) === 0) {
    /* admin */
    var authorized;
    if(req.headers.authorization) {
      auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
      if(auth) authorized = !!(config.auth.id == auth[0] && config.auth.pw == auth[1]);
    }
    if(authorized) {
      next();
    } else {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="Verizon"');
      res.end('Unauthorized');
    }
  } else {
    next();
  }
});

/**************************************
 * Route for all static assets
 **************************************/
app.use(rootPath, express.static(__dirname + publicPath));
app.use(imagePath, express.static(__dirname + imagePath));


// /**************************************
//  * bodyParser
//  **************************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/**************************************
 * Handlebars
 **************************************/
var hbs = exphbs.create({ defaultLayout: 'main' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


/**************************************
 * JSON
 **************************************/
app.get(jsonPath, function  (req, res) {
  res.json({
    version: version,
    upload: config.upload,
    users: lib.users.get()
  });
});

app.get(jsonPath + '/:id', function  (req, res) {
  var id = req.params.id,
    isAll = !!(id === 'all'),
    user = lib.users.find(id);
  if(user || isAll) {
    query = isAll? {} : { 'id': user.id };
    lib.db.find(query, function(results) {
      res.json({
        version: version,
        results: lib.users.removeCode(results)
      });
    });
  } else {
    res.json({
      version: version,
      results: []
    });
  }
});

/**************************************
 * Upload
 **************************************/
app.post('/upload', function (req, res){
  lib.file.upload(req, imagePath, function(e) {
    if(e.status === 'success') {
      lib.db.insert(e.dat, function() {
        console.log('upload succeeded'.orange);
        res.json({
          status: 'success',
          result: e.dat
        });
      });
    } else {
      res.json(e);
    }
  });
});


/**************************************
 * Admin
 **************************************/
app.get(adminPath, function(req, res) {
  lib.db.findAll(function(results) {
    res.render('admin', {version: version, results: results, config: config, data: data});
  });
});

app.get(adminPath + '/:mode/:query', function(req, res) {
  var mode = req.params.mode,
    query = req.params.query;
  if(mode === 'user') {
    lib.db.find({id:query}, function(results) {
      res.render('admin', {version: version, results: results, config: config, data: data});
    });
  } else if(mode === 'remove') {
    if(query === 'all') {
      lib.file.removeImages(req, imagePath.substr(1), function() {
        lib.db.removeAll(function() {
          // res.redirect(adminPath);
          res.end('Removed all');
        });
      });
    } else {
      var remove = function(items) {
        var id = items.shift();
        lib.db.removeById(id, function(results) {
          if(items.length > 0) remove(items);
          else res.redirect(adminPath);
        });
      };
      remove(query.split('|'));
    }
  } else {
    res.redirect(adminPath);
  }
});

