const express = require("express");
const RSVP = require("rsvp");
const fs = require("fs");
const { join } = require('path');
const uuidV1 = require("uuid/v1");
const rimraf = require("rimraf");
const redis = require("redis"),
  client = redis.createClient();
const router = express.Router();
const IMG_DIR = require("./const.js").IMG_DIR;
const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source =>
  fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory)

client.on("error", function(err) {
  console.log("Redis Error: " + err);
});

var readDB = function(key) {
  var promise = new RSVP.Promise(function(resolve, reject) {
    client.get(key, handler);

    function handler(err, res) {
      if (res) {
        resolve(res);
      } else {
        reject(err);
      }
    }
  });

  return promise;
};

var writeDB = function(key, value) {
  var promise = new RSVP.Promise(function(resolve, reject) {
    client.set(key, value, handler);

    function handler(err, res) {
      if (res) {
        resolve(res);
      } else {
        reject(err);
      }
    }
  });

  return promise;
};

router.get("/", function(_req, res, _next) {
  readDB("picInfo")
    .then(function(dbres) {
      var picInfo = JSON.parse(dbres);
      res.json(picInfo);
    })
    .catch(function(error) {
      res.status(500).send(err);
    });
});

router.get("/restoreDB", function(_req, res, _next) {
  var picInfo = {
    arr: [],
    picCount: 0
  };
  var picCount = 0;
  getDirectories(IMG_DIR).forEach(folder => {
    fs.readdirSync(join(folder, "/")).forEach(file => {
      var tagRegex = /(.*?)\.(?:jpg|gif|png)/;
      var thumbnailname = tagRegex.exec(file) && (tagRegex.exec(file)[1] + "_thumbnail.jpeg");
      const folderRelativePath = folder.split(IMG_DIR)[1];
      if (tagRegex.test(file)) {
        picInfo.arr.push({
          uuid: uuidV1(),
          filename: file,
          filepath: join(IMG_DIR, folderRelativePath, file),
          fileurl: "/images/" + folderRelativePath + "/" + file,
          thumbnailname: thumbnailname,
          thumbnailpath: join(IMG_DIR, folderRelativePath, thumbnailname),
          thumbnailurl: "/images/" + folderRelativePath + "/" + thumbnailname
        });
        picCount++;
      }
    });
  });
  picInfo.picCount = picCount;
  writeDB("picInfo", JSON.stringify(picInfo))
    .then(function(dbres) {
      console.log("Update picInfo status: " + dbres);
      res.json({
        status: 1,
        message: "The database was successfully restored"
      });
    })
    .catch(function(error) {
      // handle errors
      res.status(500).send(err);
    });
});

router.get("/clearDB", function(_req, res, _next) {
  var picInfo = {
    arr: [],
    picCount: 0
  };
  client.set("picInfo", JSON.stringify(picInfo), function(err, dbres) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(dbres);
    }
  });
});

router.get("/deleteAllImages", function(_req, res, _next) {
  rimraf(IMG_DIR, function () {
    res.json("done");
  });
});

module.exports = router;
