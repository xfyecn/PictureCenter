const express = require('express');
const RSVP = require('rsvp');
const fs = require('fs');
const uuidV1 = require('uuid/v1');
var rimraf = require('rimraf');
const redis = require('redis'),
      client = redis.createClient();
const router = express.Router();
const IMG_DIR = require('./const.js').IMG_DIR;

client.on('error', function(err) {
  console.log('Redis Error: ' + err);
});

var readDB = function(key) {
  var promise = new RSVP.Promise(function(resolve, reject){
    client.get(key, handler);

    function handler(err, res) {
      if (res) {
        resolve(res);
      } else {
        reject(err);
      }
    };
  });

  return promise;
};

var writeDB = function(key, value) {
  var promise = new RSVP.Promise(function(resolve, reject){
    client.set(key, value, handler);

    function handler(err, res) {
      if (res) {
        resolve(res);
      } else {
        reject(err);
      }
    };
  });

  return promise;
};

router.get('/', function(req, res, next) {
	readDB('picInfo').then(function(dbres) {
    var picInfo = JSON.parse(dbres);
    res.json(picInfo);
	}).catch(function(error) {
    res.status(500).send(err);
  });
});

router.get('/rescueDB', function(req, res, next) {
  var picInfo = {
    arr: [],
    picCount: 0
  };
  var picCount = 0;
  fs.readdirSync(IMG_DIR).forEach(folder => {
    console.log('Image save folder: ' + folder);
    fs.readdirSync(IMG_DIR + folder + '/').forEach(file => {
      var thumbnailname = file.split('.jpg')[0] + '_thumbnail.jpeg';
      if(file.indexOf('.jpg') !== -1) {
        picInfo.arr.push({
          uuid: uuidV1(),
          filename: file,
          filepath: IMG_DIR + folder + '/' + file,
          fileurl: '/images/' + folder + '/' + file,
          thumbnailname: thumbnailname,
          thumbnailpath: IMG_DIR + folder + '/' + thumbnailname,
          thumbnailurl: '/images/' + folder + '/' + thumbnailname
        });
        picCount++;
      }
    });
  });
  picInfo.picCount = picCount;
  writeDB('picInfo', JSON.stringify(picInfo)).then(function(dbres) {
    console.log('Update picInfo status: ' + dbres);
    res.json({
      status: 1,
      message: 'rescueDB success'
    });
  }).catch(function(error) {
    // handle errors
    res.status(500).send(err);
  });
});

router.get('/clearDB', function(req, res, next) {
  client.set("picInfo", "", function(err, dbres){
    if(err) {
      res.status(500).send(err);
    } else {
      res.json(dbres);
    }
  });
});

router.get('/deleteAllImages', function(req, res, next) {
  // rimraf(IMG_DIR, function () {
    res.json('done');
  // });
});

module.exports = router;
