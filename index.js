var request = require('request');
var Promise = require('promise');
var BuildModel = require('./model.js');
var fs = require('fs');

var baseurl = 'https://utv.sjv.se/jenkins/view/kontroll/job/'
var branch = 'atlas-snapshot-7.1';
var urlSuffix = '/api/json?pretty=true';

var buildsUrl = baseurl + branch + urlSuffix;

var getbuilds = new Promise(function(resolve, reject) {
	var details = [];

	request(buildsUrl, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	var result = JSON.parse(body);
	    for(b in result.builds) {
	    	details.push(buildDetails(result.builds[b]));
	    }
	    resolve(details);
	  }
	});

});


var buildDetails = function(build) {

	return new Promise(function(resolve, reject) {

		var buildDetailsUrl = build.url + urlSuffix;
		//console.log(buildDetailsUrl);
		
		request(buildDetailsUrl, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	//console.log(body);
		  	var result = JSON.parse(body);
		    resolve(result);
		  }
		});

	});

};



getbuilds.then(function(result) {
	var builds = [];

	Promise.all(result)
	  .then(function (res) {
  	
	  	for (r in res) {
	  		if (res[r].changeSet.items.length > 0) {
	  			builds.push(buildModel(res[r]));
	  		}
	  	}


	}).finally(function() {

		var filtered = builds.filter(function(b) {
			return b.result !== 'FAILURE';
		});
		writeHistoryToFile(filtered);

	});

});

var buildModel = function(res) {
  	var o =  {};
  	o.id = res.id;
  	o.user = res.changeSet.items[0].user;
 	o.msg = res.changeSet.items[0].msg;
  	o.date = res.changeSet.items[0].date;
	o.result = res.result;
	return o;
}


var writeHistoryToFile = function(history) {
  if (history.length > 0) {
  	console.log('Skriver historiken till fil.');
    fs.writeFile("./history.json", JSON.stringify(history), function(err) {
    });
  }
}