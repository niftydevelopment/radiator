var Promise = require('promise');
var fs = require('fs');


var fetch = function() {
  console.log('Properties: fetch');

  return new Promise(function(resolve, reject) {

    fs.readFile('./app/properties/builds.json', 'utf8', function (err, data) {
      
      var urlSuffix = '/api/json?pretty=true';
      
      var baseurl = 'https://utv.sjv.se/';
      if (process.env.MOCK) {
        baseurl = 'http://localhost:3000/'
      }

      baseurl += 'jenkins/view/kontroll/job/';
      
      var builds = JSON.parse(data);
      builds.forEach(function(p) {
        p.jUrl = baseurl + p.jenkins + urlSuffix;        
      });

      resolve(builds);
    
    });


  });

}


exports.fetch = fetch;