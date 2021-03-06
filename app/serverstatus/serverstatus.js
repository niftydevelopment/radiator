var request = require('request');
var cheerio = require('cheerio');
var Promise = require('promise');
var fs = require('fs');

var nServers, servers;

var resolved, rejected;


var getServers = function() {
  //console.log('getServers()');

  return new Promise(function(res, rej) {
    fs.readFile('./app/properties/servers.json', 'utf8', function(err, data) {
      res(data);
    });
  });

}

exports.fetch = function() {

  return new Promise(function(res, rej) {

    resolved = res;

    getServers().then((serverList) => {
      servers = JSON.parse(serverList);
      nServers = servers.length;

      servers.forEach((s) => {
        getBuildInfo(s, parseBuildInfo);
      });

    });

  });

}


var getBuildInfo = function(server, callback) {
  //console.log('getBuildInfo()');

  var headers = {
    'X-USERID': 'MSTEN',
    'server-id': server.id
  }

  if (server.cookie) {
    headers.Cookie = server.cookie;
  }

  if (process.env.MOCK) {
    server.serverurl = 'http://localhost:3000/serverstatus'
  }

  request({ headers, uri: server.serverurl, method: 'GET' }, callback);
}

var parseBuildInfo = function(err, res, body) {
  //Cookie:JSESSIONID=6OQpLXxWVZsRDeHWB+mk2Gb0
  //console.log(Object.keys(res.headers));
  //console.log(res.headers['set-cookie']);

  nServers--;

  if (err) {
    //console.log('server ligger nere');
  } else {

    var $ = cheerio.load(body);

    var x = $('img');

    //Servern är upp men inget vettigt svar.
    if (!x || Object.keys(x).length === 0 || !x[0]) {
      return;
    }



    var i = 0;
    var currentServerIndex = 0;
    servers.forEach((s) => {
      if (s.id === res.req._headers['server-id']) {
        currentServerIndex = i;
      }
      i++;
    });


    var info = [];

    var buildInfo = x[0].attribs.title;
    var b = buildInfo.split(',');

    b.forEach(function(e) {
      e.split(': ').forEach(function(ee) {
        info.push(ee);
      });
    });

    servers[currentServerIndex].buildinfo = info;
    servers[currentServerIndex].cookie = res.headers['set-cookie'];
  }

  if (nServers === 0) {
    //console.log('Parsed info:', servers[0].buildinfo[1]);
    resolved(servers);
  }

}
