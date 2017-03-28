var request = require('request');
var cheerio = require('cheerio');
var Promise = require('promise');

var nServers, servers;

var resolved, rejected;

var promise = new Promise(function(res, rej) {
  resolved = res;
  rejected = rej;
});


var getServers = function() {
  fs.readFile('./app/properties/servers.json', 'utf8', function(err, data) {
    resolve(builds);
  });
}

exports.fetch = function() {

  getServers().then((serverList) => {
    servers = serverList;
    nServers = servers.length;

    servers.forEach((s) => {
      getBuildInfo(s, parseBuildInfo);
    });
  });

  return promise;
}


var getBuildInfo = function(server, callback) {

  var headers = {
    'X-USERID': 'MSTEN',
    'server-id': server.id
  }

  if (server.cookie) {
    headers.Cookie = server.cookie;
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
    if (!x || Object.keys(x).length === 0) {
      return;
    }

    var currentServer;
    servers.forEach((s) => {
      if (s.id === res.req._headers['server-id']) {
        currentServer = s;
      }
    });


    var info = [];

    var buildInfo = x[0].attribs.title;
    var b = buildInfo.split(',');

    b.forEach(function(e) {
      e.split(': ').forEach(function(ee) {
        info.push(ee);
      });
    });

    currentServer.buildinfo = info;
    currentServer.cookie = res.headers['set-cookie'];
    //console.log(currentServer);

  }

  if (nServers === 0) {
    resolved(servers);
  }

}
