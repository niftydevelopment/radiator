var fs = require('fs');
var Promise = require('promise');
var _ = require('lodash');

var historyFile = './history.json';

var savedata = function(buildsFromJenkins) {
  
  //console.log('SaveData: savedata');
  
  return new Promise(function(resolve, reject) {

    readstoreddata().then(function(storedBuilds) {    
      var unionOfBuilds = uniondata(storedBuilds, buildsFromJenkins);

      if (storedBuilds.length === unionOfBuilds.length) {
        reject(unionOfBuilds);
        return;
      }

      fs.writeFile(historyFile, JSON.stringify(unionOfBuilds), function(err) {
        resolve(unionOfBuilds);
      });

    });

  });

};

var uniondata = function(storedBuilds, newBuilds) {
  return _.unionBy(storedBuilds, newBuilds, 'id');
}

var readstoreddata = function() {

  return new Promise(function(resolve, reject) {
    
    fs.readFile(historyFile, 'utf8', function (err, storedBuilds) {

      if (!storedBuilds) {
        storedBuilds = [];
      } else {
        storedBuilds = JSON.parse(storedBuilds);
      }

      resolve(storedBuilds);
    });

  });
  
}

var createunion = function(buildsFromJenkins) {

  return new Promise(function(resolve, reject) {

    readstoreddata().then(function(storedBuilds)   {
      resolve(uniondata(storedBuilds, buildsFromJenkins));
    });

  });

}

exports.save = savedata;
exports.uniondata = createunion;
