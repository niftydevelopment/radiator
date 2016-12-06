var _ = require('lodash');
var colors = require('colors');
var figlet = require('figlet');
var Promise = require('promise');

var generate = function(builds) {
  //console.log('generate report', builds[0].formatedCoverage);
  //return;

  if (builds.length === 0) {//det finns ingen förändring sedan sist. Skriv inte ut något.
    return;
  };

  builds = _.orderBy(builds, 'formattedDate');
  var currentStatus = builds[0].result;

  //var coverage = _.orderBy(builds, 'coverage');
  //console.log(coverage);

  printAtlas(currentStatus, builds[0].formatedCoverage).then(function() {

    var stars = 'Build history: ';
    var prevBuild = null;
    builds.forEach(function(b) {
      //console.log(b.coverage);
      if (b.result === 'SUCCESS') {
        
        if (!prevBuild) {
          stars += '-';
          return;
        }

        if (!b.coverage) {
          stars += '-';
          return;
        }

        if (b.coverage > prevBuild.coverage) {
          stars += '*';
        } else if (b.coverage > prevBuild.coverage) {
          stars += ':-(';
        } else {
          stars += '-';
        }

      } else if (b.result === 'FAIL') {
        stars += 'x';  
      } else {
        stars += '?';  
      }
      prevBuild = b;
    });

    console.log('');
    console.log(stars);
    console.log('');

    var failedBuids = getFailedBuildsInOrder(builds);

    builds = _.orderBy(builds, 'formattedDate');
    for (var i = 0; i < 7; i++) {
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
   return b.result === 'FAIL';
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

  if (build.result !== 'FAIL') {
    console.log(colors.green('******************************************************'));
    console.log(colors.green(build.user));
    console.log('Kommentar' + build.msg);
  } else {
    console.log(colors.red('******************************************************'));
    console.log(colors.red(build.user));
    console.log('Kommentar' + build.msg);
  }
} 

var printAtlas = function(status, coverage) {

  if (!coverage) {
    coverage = '?';
  }

  var color = colors.green;
  if (status === 'FAIL') {
    color = colors.red;
  }

  return new Promise(function(resolve) {

    figlet('** A T L A S '+ coverage + ' **', function(err, data) {
      console.log(color(data));
      resolve();
    });

  });

}

exports.generate = generate;