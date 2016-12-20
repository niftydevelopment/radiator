var request = require('request');
var Promise = require('promise');
var BuildModel = require('./model.js');
var fs = require('fs');


var branch = 'atlas-snapshot-trunk';
var urlSuffix = '/api/json?pretty=true';

var poll = function(jobs) {
  console.log('Jenkins: poll', jobs.length);

  return new Promise(function(resolve, reject) {

    var builds = [];  
    var buildDetails = [];   
    jobs.forEach(function(j) {
      builds.push(getBuilds(j.jUrl)); //ett promise med [] av promises
    });

    console.log('>>>>>>>>>' + builds.length, builds.length);      

    Promise.all(builds).then(function (res) {
      
      console.log('<<<<<<<<<<<<<<<', builds.length);
      
      for (r in res) {
        if (res[r].changeSet.items.length > 0) {
          buildDetails.push.apply(buildModel(res[r]));
        }
      }

    }).finally(function() {
      console.log('>>>>>>>>>>>>>>>>', buildDetails.length);
      
      resolve(buildDetails);
    });


  });

}

  var getBuilds = function(jenkinsUrl) {
    console.log('   Jenkins: getBuilds', jenkinsUrl);

    return new Promise(function(resolve, reject) {

      var details = [];

      request(jenkinsUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {

          var result = JSON.parse(body);
          
          //console.log('>>>>>>>>>>>>', body);

          for(b in result.builds) {
            console.log('something', b);
            details.push.apply(details, buildDetails(result.builds[b]));
          }

          resolve(details);
        }
      });

    });

  }


  var buildDetails = function(build) {
    //console.log('   Jenkins: buildDetails:', build);

    return new Promise(function(resolve, reject) {

      var buildDetailsUrl = build.url + urlSuffix;

      if (process.env.MOCK) {
        buildDetailsUrl = buildDetailsUrl.replace('https://utv.sjv.se/', 'http://localhost:3000/');      
      }

      //console.log('> buildDetails', buildDetailsUrl);

      request(buildDetailsUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          //console.log(body);
          var result = JSON.parse(body);
          resolve(result);
        }
      });

    });

  };


  var buildModel = function(res) {
    var o =  {};
    o.id = res.id;
    o.user = res.changeSet.items[0].user;
    o.msg = res.changeSet.items[0].msg;
    o.date = res.changeSet.items[0].date;
    o.formattedDate = res.changeSet.items[0].date.replace(/\D/g,'');//2016-12-02T12:33:40.126635Z
    o.result = res.result;
    o.fullDisplayName = res.fullDisplayName;
    return o;
  }


  exports.poll = poll;