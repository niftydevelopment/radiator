var _ = require('lodash');
var colors = require('colors');

var generate = function(builds) {
  //console.log('generate report', builds.length);

  if (builds.length === 0) {//det finns ingen förändring sedan sist. Skriv inte ut något.
    return;
  };

  console.log(colors.blue('*******O****OOOOOOOOO**OOO**********O**********OOO********'));
  console.log(colors.blue('******O*O*******O*******O**********O*O********O***********'));
  console.log(colors.blue('*****O***O******O*******O*********O***O******O************'));
  console.log(colors.blue('****OOOOOO******O*******O********OOOOOOO******OOOO********'));
  console.log(colors.blue('***O******O*****O*******O*******O*******O*********O*******'));
  console.log(colors.blue('***O******O*****O*******O****O**O*******O********O********'));
  console.log(colors.blue('***O******O****OOO******OOOOOO**O*******O*****OOO*********'));


  var failedBuids = getFailedBuildsInOrder(builds);

  for (var i = 0; i < 5; i++) {

  	if (builds[i].result !== 'FAILURE') {
  		console.log(colors.green('**********************************************************'));
  		console.log(colors.green(builds[i].user));
  		console.log('Kommentar' + builds[i].msg);
  	} else {
      console.log(colors.green('**********************************************************'));
	  	console.log(colors.red(builds[i].user));
	   	console.log('Kommentar' + builds[i].msg);
  	}

  }

  console.log(colors.green('**********************************************************'));

  if (failedBuids.length > 0) {
  	 console.log('Den som just nu skall bjuda på öl på nästa AW är:');
     console.log(colors.random(failedBuids[0].user));
  } else {
     console.log('Den som just nu skall bjuda på öl på nästa AW är: ', colors.random('CHEFEN!!!'));
  }
}


var getFailedBuildsInOrder = function(builds) {

  var failedBuilds = builds.filter(function(b) {
   return b.result === 'FAILURE';
  });
  
  if (failedBuilds.length > 0) {
    failedBuilds = _.chain(failedBuilds).groupBy('user').map(function(o) {
      return {
        'user': o[0].user,
        'failedBuilds': o.length
      };
    }).sortBy(failedBuilds, [function(o) { return !o.failedBuilds; }]).value();

    return failedBuilds;

  } else {
    return [];
  }

}


exports.generate = generate;