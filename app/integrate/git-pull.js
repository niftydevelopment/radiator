var exec = require('child_process').exec;
var mail = require('./mail.js');
var Promise = require('promise');

exports.execute = (x) => {

  return new Promise((resolve, reject) => {

    var cmd = 'git pull';

    exec(cmd, function(error, stdout, stderr) {
      
      if (stdout.includes('Already')) {
        resolve(stdout);
      } else {
        reject(stdout);
      }
      
    });

  });

}
