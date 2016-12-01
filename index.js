var poll = require('./poll.js');
var savedata = require('./savedata.js');
var report = require('./report.js');

setTimeout(function() { 
   poll.poll().then(function(result) {
      savedata.savedata(result).then(function() {
        report.generate(result);
      });
   });
}, 100000);