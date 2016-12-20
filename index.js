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

var initialPrint = false;

var runit = function() {

  setTimeout(function() {
    console.log('running');
    /*
    jenkins.poll()
      .then(jira.decorate)
      .then(sonar.decorate)
      .then(report.generate)
      .then(function() {
        //
      }).finally(function() {
        //
      });
    
      .then(report.generate)

      .then(jira.decorate)
      .then(jira.update)
      .then(sonar.decorate)
      .then(savedata.save)

    */

    properties.fetch()
      .then(jenkins.poll)
      .then(parser.decorate)

      .then(function(result) {

      console.log('>>>>>>', result.length);
    
    }, function(error) {
    
        console.log('error');
    
    });
    
    /*
      pollJenkins.poll().then(function(builds) {
          //console.log('Jenkins is polled');

          pollSonar.poll(builds).then(function(decoratedBuilds) {
            //console.log('Sonar is polled');

            savedata.savedata(decoratedBuilds).then(function(savedData) {
              console.log('new data to print', savedData.length);
              report.generate(savedData);
              initialPrint = true;
            }, function(savedData) {
              //console.log('no new data to print', savedData.length);

              if (!initialPrint) {
                report.generate(savedData);
                initialPrint = true;
              }

            });


          });
      });
      */

    runit();
  }, 1000);
}
