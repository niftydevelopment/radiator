var poll = require('./poll.js');
var savedata = require('./savedata.js');
var report = require('./report.js');
var colors = require('colors');

var runit = function() {
  setTimeout(function() { 
    //console.log('running');

    poll.poll().then(function(result) {
      //console.log('poll is done ok');

      savedata.savedata(result).then(function(savedData) {
      	//console.log('generate report', result.length);
        report.generate(savedData);
        chefen = false;

      }, function() {
        //
      });

    });

    runit();
  }, 1000);
}

runit();




