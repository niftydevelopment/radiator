var fs = require('fs');
var Promise = require('promise');
var _ = require('lodash');

var historyFile = './history.json';

var savedata = function(newBuilds) {
  
  readstoreddata().then(function(storedBuilds) {    
    var data = uniondata(storedBuilds, newBuilds);
    //console.log('>>>>>', data);

    fs.writeFile(historyFile, JSON.stringify(data), function(err) {
      console.log('data is stored!');
    });

  });

};

var uniondata = function(storedBuilds, newBuilds) {
  return _.unionBy(storedBuilds, newBuilds, 'id');
}

var readstoreddata = function() {

  return new Promise(function(resolve, reject) {
    
    fs.readFile(historyFile, 'utf8', function (err, storedBuilds) {
      resolve(JSON.parse(storedBuilds));
    });

  });

  
}

exports.savedata = savedata;
