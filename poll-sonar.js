var request = require('request');
var Promise = require('promise');

var poll = function(builds) {
  
  console.log('get stuff from Sonar');
  
  var baseurl = 'http://vl-bygget-icc:9000/';
  if (process.env.MOCK) {
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

exports.decorate = poll;