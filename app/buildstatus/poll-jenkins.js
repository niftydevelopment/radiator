var request = require('request');
var Promise = require('promise');
var fs = require('fs');

var urlSuffix = 'api/json?pretty=true';

var poll = function(jobs) {
  //console.log('Jenkins: poll', jobs.length);

  return new Promise(function(resolve, reject) {

    var jobDetails = [];  
    var builds = [];
    var buildDetails = [];
    var buildModels = [];

    jobs.forEach(function(j) {
      jobDetails.push(getBuilds(j.jUrl));
    
    });

    Promise.all(jobDetails).then(function(result) {      
      
      result.forEach(function(detail) {
        detail.builds.forEach(function(bbb) {
          builds.push(bbb);  
        });

      });

      builds.forEach(function(b) {
        buildDetails.push(getDetailsForABuild(b));
      });

      Promise.all(buildDetails).then(function(res) {
        for (r in res) {
          if (res[r].changeSet.items.length > 0) {
            buildModels.push(buildModel(res[r]));
          }
        }

      }).finally(function() {
        resolve(buildModels);
      });

    })


  });

}

  var getBuilds = function(jenkinsUrl) {
    //console.log('   Jenkins: getBuilds', jenkinsUrl);

    return new Promise(function(resolve, reject) {
      if (process.env.MOCK === true) {
        jenkinsUrl = jenkinsUrl.replace('https://utv.sjv.se/', 'http://localhost:3000/');
      }

      //console.log("jenkinsURL", jenkinsUrl);

      request(jenkinsUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var build = JSON.parse(body);
          resolve(build);
        }
      });

    });

  }


  var getDetailsForABuild = function(build) {
    return new Promise(function(resolve, reject) {
      var lastPart = build.url.split("/");
      var id = lastPart[lastPart.length - 2];

      var buildDetailsUrl = build.url + urlSuffix;

      if (process.env.MOCK === true) {
        buildDetailsUrl = buildDetailsUrl.replace('http://vl-bygget:8080/', 'http://localhost:3000/');      
      }

      //console.log("", buildDetailsUrl);

      request(buildDetailsUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var result = JSON.parse(body);
          var oldId = result.id;

          result.id = id;
          result.fullDisplayName = result.fullDisplayName.replace("#" + oldId, "#" + id);
          resolve(result);
        } else {
          console.log('EEEERRRROROOR');
        }
      });

    });

  };


  var buildModel = function(res) {
    //console.log('--->', res.changeSet.items[0]);
    var o =  {};
    o.id = res.id;
    o.user = res.changeSet.items[0].author.fullName;
    o.msg = res.changeSet.items[0].msg;
    o.date = res.changeSet.items[0].date;
    o.formattedDate = res.changeSet.items[0].date.replace(/\D/g,'');//2016-12-02T12:33:40.126635Z
    o.result = res.result;
    o.fullDisplayName = res.fullDisplayName;
    o.buildName = res.fullDisplayName.replace(" #" + res.id, "");
    //console.log('-------------', o.result);
    return o;
  }


  exports.poll = poll;