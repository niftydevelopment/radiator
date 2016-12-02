var poll = require('./poll.js');
var savedata = require('./savedata.js');
var report = require('./report.js');
var colors = require('colors');

var chefen = false;

var runit = function() {
  setTimeout(function() { 
    //console.log('running');

    poll.poll().then(function(result) {
      
      savedata.savedata(result).then(function() {
      	//console.log('generate report');
        report.generate(result);
        chefen = false;
      }, function() {
      	if (!chefen) {
      	  console.log(colors.random('Den som just nu skall bjuda på öl på nästa AW är: CHEFEN!!!'));
      	  chefen = true;
      	}

      });

    });

    runit();
  }, 1000);
}

runit();




