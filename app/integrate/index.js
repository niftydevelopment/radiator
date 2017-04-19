var exec = require('child_process').exec;
var mail = require('./mail.js');

var cmd = 'git pull';

exec(cmd, function(error, stdout, stderr) {
  mail.sendmail('bygget smäller', stdout);
});
