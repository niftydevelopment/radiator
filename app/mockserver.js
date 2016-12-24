var express = require('express');
var fs = require('fs');

var app = express();

var jenkinsBuilds = {};
fs.readFile('./mocks/jenkins.json', 'utf8', function (err, data) {
  //jenkinsBuilds = JSON.parse(data);
  jenkinsBuilds = data;
});

var jenkinsBuildDetails = {};
fs.readFile('./mocks/jenkins-details.json', 'utf8', function (err, data) {
  //jenkinsBuilds = JSON.parse(data);
  jenkinsBuildDetails = data;
});


var jira = {};
fs.readFile('./mocks/jira.json', 'utf8', function (err, data) {
  //jenkinsBuilds = JSON.parse(data);
  jira = data;
});

var sonar = {};
fs.readFile('./mocks/sonar.json', 'utf8', function (err, data) {
  //jenkinsBuilds = JSON.parse(data);
  sonar = data;
});


app.get('/', function (req, res) {
  res.send('Hello world')
});

// https://utv.sjv.se
//                    /jenkins/view/kontroll/job/atlas-snapshot-trunk/api/json?pretty=truerunning
//https://utv.sjv.se
//                        /jenkins/view/kontroll/job/atlas-snapshot-trunk/5436/



// http://vl-bygget-icc:9000
//                        /api/resources?metrics=ncloc,coverage&format=json
app.get('/api/resources', function (req, res) {
  res.send(sonar);
});

//\\d+/api/json/
app.get('/jenkins/view/kontroll/job/:job/api/json/', function (req, res) {
  console.log('pollar jenkins');
  res.send(jenkinsBuilds)
});

app.get('/jenkins/view/kontroll/job/:job/*', function (req, res) {
  console.log('Ber om detaljerna från jenkins');
  res.send(jenkinsBuildDetails)
});

app.post('/jira/rest/auth/1/session', function(req, res) {
  //console.log('Loggar in på Jira servern');
  res.send({session:{name:'', value:''}});
});

app.get('/jira/rest/api/2/issue/*', function (req, res) {
  //console.log('Server: ber Jira om detaljer');
  res.send(jira);
});




// https://etjanst.sjv.se
//                        /jira/rest/auth/1/session
// https://etjanst.sjv.se
//                        /jira/rest/api/2/issue/PCAP-17054



var server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port)
});