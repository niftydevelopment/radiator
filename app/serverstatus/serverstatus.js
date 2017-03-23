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
  //Cookie:JSESSIONID=0PwydWoQ1GzM1M9TdJv4xC5P

  nServers--;
  
  if (err) {
    //console.log('server ligger nere');
  } else {
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
      if (s.id === res.req._headers['server-id']) {
        s.buildinfo = info;
        //s.Cookie = 
      }
    });    
  }

  if(nServers === 0) {
    resolved(servers);
  }

}