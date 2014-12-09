photo-upload-test
=================

##Setup

###Install Node.js

<http://http://nodejs.org/>

<http://howtonode.org/how-to-install-nodejs>


###Install MongoDB

<http://www.mongodb.org/>

<http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/>


##Development

###Install all dependencies

```npm i```


###Run MongoDB server

```mongod --dbpath=/data --port 27017```

###Run Node server

```npm start```

###Cancel server

control + c

##Deployment

###heroku


```heroku login```

```heroku git:remote -a APP_NAME```

###Amazon S3


following this instruction
<https://devcenter.heroku.com/articles/s3-upload-node>

```heroku config:set AWS_ACCESS_KEY=xxx AWS_SECRET_KEY=yyy```

```heroku config:set S3_BUCKET = zzz```

###mongodb

```heroku addons:add mongolab```

#### get MONGOLAB_URI

```heroku config | grep MONGOLAB_URI```

Add the MONGOLAB_URI to ```json/config.json``` (line 9)

###Commit all changes

###After commit

```git push heroku master```

