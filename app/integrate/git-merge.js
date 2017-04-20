var exec = require('child_process').exec;
var mail = require('./mail.js');
var Promise = require('promise');

exports.execute = (branch) => {

  return new Promise((resolve, reject) => {

    var cmd = 'git merge' + branch;

    exec(cmd, function(error, stdout, stderr) {
      
      if (stdout.includes('TODO:PARSE THIS')) {
        resolve(stdout);
      } else {
        reject(stdout);
      }
      
    });

  });

}
