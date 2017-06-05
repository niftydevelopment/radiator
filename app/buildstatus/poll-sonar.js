var request = require('request');
var Promise = require('promise');

var poll = function(builds) {
  
  //console.log('Sonar: poll', builds.length);
  
  var baseurl = 'http://sonarqube.intern.jordbruksverket.se/';
  if (process.env.MOCK === true) {
    baseurl = 'http://localhost:3000/'
  }

  var url = baseurl + 'api/resources?metrics=ncloc,coverage&format=json';

  return new Promise(function(resolve, reject) {
    //console.log('get stuff from Sonar', url);

    request(url, function (error, response, body) {

      if (!error && response.statusCode == 200) {
        //console.log(body);
        var result = JSON.parse(body);

  	  var project = result.filter(function(r) {
  	  	return r.key === 'se.sjv.kontroll.atlas:atlas-parent';
  	  })[0];

  	  builds.forEach(function(b) {
  	  	//console.log('--->', project.msr[1].frmt_val);
  	  	b.coverage = project.msr[1].val;
  	  	b.formattedCoverage = project.msr[1].frmt_val;
  	  });

        resolve(builds);
      }

    });

  });

}

var issues = function() {
  //http://vl-bygget-icc:9000/api/issues/search?componentRoots=se.sjv.kontroll.atlas:atlas-parent
  //http://vl-bygget-icc:9000/api/issues/search?componentRoots=se.sjv.kontroll.atlas:atlas-parent&pageSize=-1
  var baseurl = 'http://sonarqube.intern.jordbruksverket.se/';
  if (process.env.MOCK === true) {
    baseurl = 'http://localhost:3000/'
  }

  var url = baseurl + 'api/issues/search?componentRoots=se.sjv.kontroll.atlas:atlas-parent';

  return new Promise(function(resolve, reject) {
    //console.log('get stuff from Sonar', url);

    request(url, function (error, response, body) {

      if (!error && response.statusCode == 200) {
        //console.log(body);
        var result = JSON.parse(body);

        var issues = result.issues.filter(function(i) {
          return i.severity === 'CRITICAL';
        }).map(function(c) {
          return {
            severity: c.severity,
            debt: c.debt,
            author: c.author
          }
        });

        resolve(builds);
      }

    });

  });
}

exports.decorate = poll;
