var _ = require('lodash');
var colors = require('colors');
var figlet = require('figlet');
var Promise = require('promise');

var generate = function(builds) {
  //console.log('generate report', builds);

  if (builds.length === 0) {//Det finns ingen förändring sedan sist. Skriv inte ut något.
    return;
  };

  builds = _.sortBy(builds, function(b) {
    return -b.formattedDate;
  });

  var lastBuild = builds.filter(function(b) {
    return b.formattedCoverage !== undefined;
  })[0];
  
  printAtlas(lastBuild, builds).then(function() {

    printBuildHistory(builds);

    var failedBuids = getFailedBuildsInOrder(builds);

    builds.forEach(function(b, i) {
      if (i > 5) {
        return;
      }
      printBuilds(b, builds); 
    });
    
    console.log(colors.green('**********************************************************'));
    if (failedBuids.length > 0) {
       console.log('Den som just nu skall bjuda på öl på nästa AW är:');
       console.log(colors.random(failedBuids[0].user));
    } else {
       console.log('Den som just nu skall bjuda på öl på nästa AW är: ', colors.random('CHEFEN!!!'));
    }

  });

}


var printBuildHistory = function(builds) {
  var stars = 'Build history: ';
  var prevBuild = null;

  builds.forEach(function(b) {
    //console.log(b.coverage);
    if (b.result === 'SUCCESS') {
      
      if (!prevBuild) {
        stars += '-,';
        return;
      }

      if (!b.coverage) {
        stars += '-,';
        return;
      }

      if (b.coverage > prevBuild.coverage) {
        stars += '*,';
      } else if (b.coverage > prevBuild.coverage) {
        stars += ':-(,';
      } else {
        stars += '-,';
      }

    } else if (b.result === 'FAIL') {
      stars += 'x,';  
    } else {
      stars += '?,';  
    }
    prevBuild = b;
  });

  console.log('');
  console.log(stars);
  console.log('');
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

var printBuilds = function(build, builds) {
  //console.log('printBuilds', build);

  if (build.result !== 'FAIL') {
    console.log(colors.green('******************************************************'));
    console.log(colors.green(build.user), printCoverageEffect(build, builds));
    console.log('Kommentar: ' + build.msg);
    console.log('Planerad för version: ' + build.jiraPlannedForVersion);
    console.log('Commitad på: '+ build.fullDisplayName);
  } else {
    console.log(colors.red('******************************************************'));
    console.log(colors.red(build.user), printCoverageEffect(build, builds));
    console.log('Kommentar: ' + build.msg);

    console.log('Planerad för version: ' + build.jiraPlannedForVersion);
    console.log('Commitad på: '+ build.fullDisplayName);
  }
}

var printCoverageEffect = function(build, builds) {
  var highestCoverage = _.maxBy(builds, function(b) {
    return b.coverage;
  }).coverage;

  var sad = highestCoverage > build.coverage;
  var happy = highestCoverage < build.coverage;
  var whatever = highestCoverage === build.coverage;

  if (sad) {
    return colors.red('AC säger Grrrr!!');
  } else if (happy) {
    return colors.green('AC är glad :-)');
  } else {
    return colors.gray('AC slår dig inte med en penna.');
  }
}

var printAtlas = function(lastBuild, builds) {
  var status = lastBuild.result;
  var formattedCoverage = lastBuild.formattedCoverage;

  var color = colors.green;
  
  if (!formattedCoverage) {
    formattedCoverage = '?';
  } else {
    var highestCoverageBuild = _.maxBy(builds, 'coverage');

    if (highestCoverageBuild.coverage > lastBuild.coverage) {
      color = colors.red;
    } else if (highestCoverageBuild.coverage === lastBuild.coverage) {
      color = colors.gray;
    }

  }

  if (status === 'FAIL') {
    color = colors.red;
  }

  return new Promise(function(resolve) {

    figlet('** A T L A S ' + formattedCoverage + ' **', function(err, data) {
      console.log(color(data));
      resolve();
    });

  });

}

exports.generate = generate;