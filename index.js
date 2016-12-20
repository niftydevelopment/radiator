var colors        = require('colors');
var program       = require('commander');
var Promise       = require('promise');

var properties    = require('./properties.js');
var jenkins       = require('./poll-jenkins.js');
var jira          = require('./poll-jira.js');
var sonar         = require('./poll-sonar.js');
var savedata      = require('./savedata.js');
var report        = require('./report.js');
var parser        = require('./parser.js');


var init = function() {

  return new Promise(function(resolve, reject) {

  program
    .version('0.0.4')
    .description('AC 4 president!')
    .option('-n, --numberofbuilds <n>', 'Antal builds som skall visas')
    .option('-m, --mock', 'Kör mot mockat läge')
    .parse(process.argv);

  var OPTS = {n:8,m:false};

  if (program.numberofbuilds) {
    OPTS.n = program.numberofbuilds;
  }

  if (program.mock) {
    OPTS.m = true;
    process.env['MOCK'] = OPTS;
  }
  
  console.log('Radiator startad:');
  if (program.mock) {
    console.log('  - i mockat läge');
  }

  console.log('  - %j antal builds visas', program.numberofbuilds);

  resolve();

  });

}



init().then(function() {
  runit();
});

var resultOfPoll = [];

var runit = function() {

  setTimeout(function() {
    console.log('running');

    properties.fetch()
      .then(jenkins.poll)
      .then(parser.decorate)
      .then(jira.decorate)
      .then(jira.update)
      .then(sonar.decorate)
      .then(function(result) {

      //console.log('>>>>>>', result.length);
      resultOfPoll = result;
    
    }, function(error) {
      console.log('error');
    }).finally(function() {

      savedata.save(resultOfPoll).then(function() {
        report.generate(resultOfPoll);
      }, function() {
        //
      });

    });

    runit();
  }, 1000);
}
