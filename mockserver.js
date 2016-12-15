var express = require('express');
var fs = require('fs');

var app = express();

var jenkinsBuilds = {};
fs.readFile('./mocks/jenkins.json', 'utf8', function (err, data) {
  //jenkinsBuilds = JSON.parse(data);
  jenkinsBuilds = data;
});

app.get('/', function (req, res) {
  res.send('Hello world')
});

// https://utv.sjv.se
//                        /jenkins/view/kontroll/job/
//https://utv.sjv.se
//                        /jenkins/view/kontroll/job/atlas-snapshot-trunk/5436/
app.get('/jenkins/view/kontroll/job/*', function (req, res) {
  console.log('pollar jenkins', jenkinsBuilds);
  res.send(jenkinsBuilds)
});

app.get('/jenkins/view/kontroll/job/atlas-snapshot-trunk/*', function (req, res) {
  console.log('Ber om detaljerna från jenkins');
  res.send('detaljer av ett jobb')
});

// http://vl-bygget-icc:9000
//                        /api/resources?metrics=ncloc,coverage&format=json
app.get('/api/resources', function (req, res) {
  res.send('sonar stats')
});

// https://etjanst.sjv.se
//                        /jira/rest/auth/1/session
// https://etjanst.sjv.se
//                        /jira/rest/api/2/issue/PCAP-17054
app.get('/jira/rest/api/2/issue/*', function (req, res) {
  res.send('jira prylar')
});


var server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port)
});