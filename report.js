var _ = require('lodash');
var colors = require('colors');

var generate = function(builds) {
  console.log('generate report', builds.length);

  var failedBuids = builds.filter(function(b) {
	return b.result === 'FAILURE';
  });

console.log('>>>>>>>>>>>>', failedBuids.length);	  

  if (failedBuids.length > 0) {
	  var failedBuids = _.chain(failedBuids).groupBy('user').map(function(o) {
	    return {
	      'user': o[0].user,
	      'failedBuilds': o.length
	    };
	  }).sortBy(result, [function(o) { return !o.failedBuilds; }]).value();
  }

  console.log('>>>>>>>>>>>>');
  for (var i = 0; i < 5; i++) {

  	if (builds[i].result === 'SUCCESS') {
  		console.log(colors.green('*************************************'));
  		console.log(colors.green(builds[i].user));
		console.log('Kommentar' + builds[i].msg);
  	} else {
	  	console.log(colors.red('*************************************'));
	  	console.log(colors.green(builds[i].user));
		console.log('Kommentar' + builds[i].msg);
  	}
  }

  if (failedBuids.length > 0) {
  	 console.log('Den som just nu skall bjuda på öl på nästa AW är:', failedBuids[0].user);
  }
}

exports.generate = generate;