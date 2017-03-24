var request = require('request');
var cheerio = require('cheerio');
var Promise = require('promise');

var servers = [
  { server: 'Jorden utv', serverurl: 'http://vl-jordenutv:8080/jorden/admin/admin', id: 'jorden-utv' },
  { server: 'Jorden Atlas Docker', serverurl: 'http://vl-atomictest02:8101/jorden/admin/admin', id: 'jorden-a-docker' },
  { server: 'Jorden Volym', serverurl: 'http://vl-jordenvol01:8080/jorden/admin/admin', id: 'jorden-volym' },
  { server: 'Jorden test 1', serverurl: 'http://vl-jordentest:8080/jorden/admin/admin', id: 'jorden-test-1' },
  { server: 'Jorden test 2', serverurl: 'http://vl-jordentest2-01:8080/jorden/admin/admin', id: 'jorden-test-2' },

  { server: 'Atlas test 1', serverurl: 'http://vl-atlastest01:8080/atlas/start', id: 'atlas-test1' },
  { server: 'Atlas utv 1', serverurl: 'http://vl-kontrollutv:8080/atlas/start', id: 'atlas-utv' },
  { server: 'Atlas test 2', serverurl: 'http://vl-atlastest2-01:8080/atlas/start', id: 'atlas-test2' },
  { server: 'Atlas prestanda', serverurl: 'http://vl-atlasp01:8080/atlas/start', id: 'atlas-prestanda' },
  { server: 'Atlas docker', serverurl: 'http://vl-atomictest02:8102/atlas/start', id: 'atlas-docker' },
  { server: 'Atlas volym', serverurl: 'http://vl-atlasvol01:8080/atlas/start', id: 'atlas-volym' }
];

var nServers = servers.length;

var resolved, rejected;

var promise = new Promise(function(res, rej) {
  resolved = res;
  rejected = rej;
});


exports.fetch = function() {
  servers.forEach((s) => {
    getBuildInfo(s, parseBuildInfo);
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
  

  request({headers, uri: server.serverurl, method: 'GET'}, callback);
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
    if(!x || Object.keys(x).length === 0) {
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

  if(nServers === 0) {
    resolved(servers);
  }

}