var request = require('request');
var Promise = require('promise');
var BuildModel = require('./model.js');
var fs = require('fs');

var branch = 'atlas-snapshot-trunk';
var urlSuffix = '/api/json?pretty=true';

  var poll = function() {
    console.log('poll');
    
    var baseurl = 'https://utv.sjv.se/';
    if (process.env.MOCK != null) {
      baseurl = 'http://localhost:3000/'
    }

    baseurl += 'jenkins/view/kontroll/job/';
    
    var buildsUrl = baseurl + branch + urlSuffix;
    
    return new Promise(function(resolve, reject) {
      var builds = [];
      
      getbuilds(buildsUrl).then(function(result) {    
  
        
        Promise.all(result).then(function (res) {
          for (r in res) {
            if (res[r].changeSet.items.length > 0) {
              builds.push(buildModel(res[r]));
            }
          }

        }).finally(function() {
          resolve(builds);
        });

      });



    });
  }

  var getbuilds = function(buildsUrl) {
    console.log('getbuilds');
    
    return new Promise(function(resolve, reject) {
      var details = [];

      request(buildsUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          
          var result = JSON.parse(body);
          for(b in result.builds) {
            details.push(buildDetails(result.builds[b]));
          }
          resolve(details);
        }
      });

    });

  }


  var buildDetails = function(build) {

    return new Promise(function(resolve, reject) {

      var buildDetailsUrl = build.url + urlSuffix;

      buildDetails = 'http://localhost:3000/jenkins/view/kontroll/job/atlas-snapshot-trunk/5436/';
      
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
    return o;
  }


  exports.poll = poll;