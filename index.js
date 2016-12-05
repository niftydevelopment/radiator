var poll = require('./poll.js');
var savedata = require('./savedata.js');
var report = require('./report.js');
var colors = require('colors');

var initialPrint = false;

var runit = function() {

  setTimeout(function() {

    //console.log('running');

    poll.poll().then(function(result) {
      //console.log('poll is done ok', result.length);

      savedata.savedata(result).then(function(savedData) {
      	//console.log('new data to print', savedData.length);
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

    runit();
  }, 1000);
}

runit();




