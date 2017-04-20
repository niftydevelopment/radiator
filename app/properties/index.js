var Promise = require('promise');
var fs = require('fs');


var fetch = function(props) {

  return new Promise(function(resolve, reject) {

    fs.readFile('./app/properties/'+ props +'.json', 'utf8', function (err, data) {
      var p = JSON.parse(data);
      resolve(p);
    });

  });

}


exports.fetch = fetch;