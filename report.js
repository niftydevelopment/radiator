var _ = require('lodash');
var colors = require('colors');
var figlet = require('figlet');
var Promise = require('promise');

var generate = function(builds) {
  //console.log('generate report', builds.length);

  if (builds.length === 0) {//det finns ingen förändring sedan sist. Skriv inte ut något.
    return;
  };

  printAtlas('SUCCESS').then(function() {

    var failedBuids = getFailedBuildsInOrder(builds);

    for (var i = 0; i < 5; i++) {
      printBuilds(builds[i]);
    }

    console.log(colors.green('**********************************************************'));

    if (failedBuids.length > 0) {
       console.log('Den som just nu skall bjuda på öl på nästa AW är:');
       console.log(colors.random(failedBuids[0].user));
    } else {
       console.log('Den som just nu skall bjuda på öl på nästa AW är: ', colors.random('CHEFEN!!!'));
    }

  });

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

var printBuilds = function(build) {
  if (build.result !== 'FAILURE') {
    console.log(colors.green('******************************************************'));
    console.log(colors.green(build.user));
    console.log('Kommentar' + build.msg);
  } else {
    console.log(colors.green('******************************************************'));
    console.log(colors.red(build.user));
    console.log('Kommentar' + build.msg);
  }
} 

var printAtlas = function(status) {
  var color = colors.green;
  if (status !== 'SUCCESS') {
    color = colors.red;
  }

  return new Promise(function(resolve) {

    figlet('** A T L A S **', function(err, data) {
      console.log(color(data));
      resolve();
    });

  });

}

exports.generate = generate;