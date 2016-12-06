var request = require('request');
var Promise = require('promise');

var url = 'http://vl-bygget-icc:9000/api/resources?metrics=ncloc,coverage&format=json'

var poll = function(builds) {

  return new Promise(function(resolve, reject) {

  request(url, function (error, response, body) {

    if (!error && response.statusCode == 200) {
      //console.log(body);
      var result = JSON.parse(body);

	  var project = result.filter(function(r) {
	  	return r.key === 'se.sjv.kontroll.atlas:atlas-parent';
	  })[0];

	  builds.forEach(function(b) {
	  	b.coverage = project.msr[1].val;
	  	b.formatedCoverage = project.msr[1].frmt_val;
	  });

      resolve(builds);
    }

  });

  });

}

exports.poll = poll;