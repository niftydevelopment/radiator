var express = require('express');
var fs = require('fs');

var app = express();

var html = {};
var readServerstatusHTML = function() {
  fs.readFile('./app/mocks/serverstatus.html', 'utf8', function (err, data) {
    //jenkinsBuilds = JSON.parse(data);
    html = data;
  });  
}
readServerstatusHTML();

var jenkinsBuilds = {};
fs.readFile('./app/mocks/jenkins.json', 'utf8', function (err, data) {
  //jenkinsBuilds = JSON.parse(data);
  jenkinsBuilds = data;
});

var jenkinsBuildDetails = {};
fs.readFile('./app/mocks/jenkins-details.json', 'utf8', function (err, data) {
  //jenkinsBuilds = JSON.parse(data);
  jenkinsBuildDetails = data;
});


var jira = {};
fs.readFile('./app/mocks/jira.json', 'utf8', function (err, data) {
  //jenkinsBuilds = JSON.parse(data);
  jira = data;
});

var sonar = {};
fs.readFile('./app/mocks/sonar.json', 'utf8', function (err, data) {
  //jenkinsBuilds = JSON.parse(data);
  sonar = data;
});


app.get('/', function (req, res) {
  res.send('Hello world')
});

app.get('/serverstatus', function (req, res) {
  console.log('Ber om serverns bygg info');
  readServerstatusHTML();
  res.send(html);
});

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