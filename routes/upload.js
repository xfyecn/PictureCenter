const express = require('express');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const fs = require('fs');
const uuidV1 = require('uuid/v1');
const RSVP = require('rsvp');
const redis = require('redis'),
      client = redis.createClient();
const router = express.Router();
const IMG_DIR = require('./const.js').IMG_DIR;

client.on('error', function(err) {
  console.log('Redis Error: ' + err);
});

// default options
router.use(fileUpload());
router.use(bodyParser.json());

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Upload' });
});

router.post('/', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFiles = req.files.photos;
  let base64Obj = {};
  if(req.body.base64Arr instanceof Array) {
    req.body.base64Arr.forEach(function(el){
      var tba = el.split('__baseSplit__');
      base64Obj[tba[0]] = tba[1];
    });
  } else {
    var tba = req.body.base64Arr.split('__baseSplit__');
    base64Obj[tba[0]] = tba[1];
  }

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

	var saveImg = function(file, dir) {
	  var promise = new RSVP.Promise(function(resolve, reject){
      // Use the mv() method to place the file somewhere on your server
      if (!fs.existsSync(IMG_DIR+dir)){
          fs.mkdirSync(IMG_DIR+dir);
      }
      file.mv(IMG_DIR+dir+'/'+file.name, handler);
      function handler(err) {
        if (err) {
	        reject(err);
        } else {
          resolve({
            uuid: uuidV1(),
            filename: file.name,
            filepath: IMG_DIR+dir+'/'+file.name,
            fileurl: '/images/'+dir+'/'+file.name
          });
        }
      }
	  });

	  return promise;
	};

	readDB('picInfo').then(function(dbres) {
	  console.log('****readDB****');
    if(dbres === null) {
      dbres = '{"arr":[]}';
    }
    var dir = uuidV1();
    var promises = null;
    if(sampleFiles instanceof Array) {
      promises = sampleFiles.map(function(el){
        return saveImg(el, dir);
      });
    } else {
      promises = [];
      promises.push(saveImg(sampleFiles, dir));
    }

	  console.log('****before process promises****');
    RSVP.all(promises).then(function(fileObjs) {
      // posts contains an array of results for the given promises
      console.log('****gen thumbnails start****');
      var picInfo = JSON.parse(dbres);
      if(!picInfo.picCount) {
        picInfo.picCount = 0;
      }
      fileObjs.forEach(function(el){
        var base64Data = base64Obj[el.filename].replace(/^data:image\/jpeg;base64,/, "");
        var fnArr = el.filename.split('.');
        fnArr.splice(fnArr.length-1, 1);
        var fName = fnArr.join('')+"_thumbnail.jpeg";
        fs.writeFileSync(IMG_DIR + dir + '/' + fName, base64Data, 'base64');
        el.thumbnailname = fName;
        el.thumbnailpath = IMG_DIR + dir + '/' + fName;
        el.thumbnailurl = '/images/' + dir + '/' + fName;
        picInfo.arr.push(el);
        picInfo.picCount += 1;
      });
      console.log('****writeDB****');
      writeDB('picInfo', JSON.stringify(picInfo)).then(function(dbres) {
        console.log('Update picInfo status: ' + dbres);
        res.send('File uploaded!');
      }).catch(function(error) {
        // handle errors
        res.status(500).send(err);
      });
    }).catch(function(reason){
      // if any of the promises fails.
      res.status(500).send(err);
    });
	}).catch(function(error) {
    console.log('read picInfo error: ' + error);
	  // handle errors
    return res.send('read picInfo failed.');
	});
});

module.exports = router;
