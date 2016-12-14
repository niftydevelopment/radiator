var pollJenkins = require('./poll-jenkins.js');
var pollSonar = require('./poll-sonar.js');
var savedata = require('./savedata.js');
var report = require('./report.js');
var colors = require('colors');

var initialPrint = false;

var runit = function() {

  setTimeout(function() {

    //console.log('running');
    
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

    runit();
  }, 10000);
}

runit();