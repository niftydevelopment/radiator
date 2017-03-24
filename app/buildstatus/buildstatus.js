var colors = require('colors');
var Promise = require('promise');

var properties = require('./properties.js');
var jenkins = require('./poll-jenkins.js');
var jira = require('./poll-jira.js');
var sonar = require('./poll-sonar.js');
var savedata = require('./savedata.js');
var parser = require('./parser.js');


var init = function() {

  return new Promise(function(resolve, reject) {


    var OPTS = { n: 8, m: false };
    OPTS.n = 5;

    OPTS.m = false;
    process.env['MOCK'] = OPTS;

    resolve();

  });

}

var startupReport = true;
var resultOfPoll = [];


var fetchBuildStatus = function() {
  console.log('fetchBuildStatus A');

  var resolve, reject;
  var result = new Promise(function(res, rej) {
    resolve = res;
    reject = rej;
  });

  init().then(() => {
console.log('fetchBuildStatus B');
      properties.fetch()
        .then(jenkins.poll)
        .then(parser.decorate)
        .then(sonar.decorate)
        .then(jira.decorate)

      .then(function(result) {
console.log('fetchBuildStatus Z');
        //console.log('>>>>>>', result.length);
        resultOfPoll = result;

      }, function(error) {
        //console.log('error');
      }).finally(function() {
        //console.log('finally', resultOfPoll.length);

        savedata.save(resultOfPoll).then(function() {
          //console.log('new data to report', result.length);

          savedata.uniondata(resultOfPoll).then((u) => {
            resolve(u);
          });

          startupReport = false;

        }, function(result) {
          //console.log('NO new data to report', result.length);

          if (startupReport) {
            savedata.uniondata(resultOfPoll).then((u) => {
              resolve(u);
            });

            startupReport = false;
          }

        });

      });




  });

  return result;

}

exports.fetchBuildStatus = fetchBuildStatus;
