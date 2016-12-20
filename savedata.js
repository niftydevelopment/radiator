var fs = require('fs');
var Promise = require('promise');
var _ = require('lodash');

var historyFile = './history.json';

var savedata = function(newBuilds) {
  
  //console.log('SaveData: savedata');
  
  return new Promise(function(resolve, reject) {

    readstoreddata().then(function(storedBuilds) {    
  
      var data = uniondata(storedBuilds, newBuilds);
      
      //console.log('   Will update stored data:', storedBuilds.length !== data.length);

      if (storedBuilds.length === data.length) {
        //console.log('No new builds.');
        reject(data);
        return;
      }

      fs.writeFile(historyFile, JSON.stringify(data), function(err) {
        //console.log('data is stored. Length:', data.length);
        resolve(data);
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

exports.save = savedata;
