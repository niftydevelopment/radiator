var serverstatus    = require('./serverstatus.js');

serverstatus.fetchBuildStatus().then(result => {
	console.log(result);
});