//curl -i -H "X-USERID: FJKAR" -H "Content-Type: application/json" -X GET http://localhost:8080/atlas/rest/test/buildinfo

/*
var util = require('util');
var exec = require('child_process').exec;

var command = 'curl -i -H "X-USERID: FJKAR" -H "Content-Type: application/json" -X GET http://localhost:8080/atlas/rest/test/buildinfo'
var commandB = 'curl -i -H "X-USERID: MSTEN" -H "Content-Type: application/json" -X GET http://vl-jordenutv:8080/jorden/admin/admin'


child = exec(commandB, function(error, stdout, stderr){

  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);

if(error !== null)
{
    console.log('exec error: ' + error);
}

});

*/

var request = require('request');
var http = require('http');
var cheerio = require('cheerio');
var Promise = require('promise');
/*
request({
    headers: {
      'X-USERID': 'MSTEN'
    },
    uri: 'http://localhost:8080/atlas/rest/test/buildinfo',
    method: 'GET'
  }, function (err, res, body) {
    console.log('-------->', body);
  });
*/

var servers = [
  { server: 'Jorden utv', serverurl: 'http://vl-jordenutv:8080/jorden/admin/admin', id: 'jorden-utv' },
  { server: 'Atlas utv', serverurl: 'http://vl-atlastest01:8080/atlas/start', id: 'atlas-utv' }
];


var nServers = servers.length;

var resolved, rejected;

var promise = new Promise(function(res, rej) {
  resolved = res;
  rejected = rej;
});


exports.fetchBuildStatus = function() {
  servers.forEach((s) => {
    getBuildInfo(s, parseBuildInfo);
  });

  return promise;
}









var getBuildInfo = function(server, callback) {
  request({
    headers: {
      'X-USERID': 'MSTEN',
      'server-id': server.id
    },
    uri: server.serverurl,
    method: 'GET'
  }, callback);
}

var parseBuildInfo = function(err, res, body) {

  nServers--;

  var $ = cheerio.load(body);

  var x = $('img');
  
  var buildInfo = x[0].attribs.title;
  var b = buildInfo.split(',');

  var info = [];
  b.forEach(function(e) {
    e.split(': ').forEach(function(ee) {
      info.push(ee);
    });
  });
  
  servers.forEach((s) => {
    //console.log(s.buildinfo);
    //console.log(s.id + '--> ' + res.req._headers['server-id']);
    if (s.id === res.req._headers['server-id']) {
      s.buildinfo = info;
    }
  });

  if(nServers === 0) {
    resolved(servers);
  }

}