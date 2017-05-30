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
  jenkinsBuilds = data;
});

var jenkinsBuildDetails = {};
fs.readFile('./app/mocks/jenkins-details.json', 'utf8', function (err, data) {
  jenkinsBuildDetails = data;
});

var jenkinsBuilds1 = {};
fs.readFile('./app/mocks/jenkins.1.json', 'utf8', function (err, data) {
  jenkinsBuilds1 = data;
});

var jenkinsBuildDetails1 = {};
fs.readFile('./app/mocks/jenkins-details.1.json', 'utf8', function (err, data) {
  jenkinsBuildDetails1 = data;
});

var jira = {};
fs.readFile('./app/mocks/jira.json', 'utf8', function (err, data) {
  jira = data;
});

var sonar = {};
fs.readFile('./app/mocks/sonar.json', 'utf8', function (err, data) {
  sonar = data;
});


app.get('/', function (req, res) {
  res.send('Hello world')
});

app.get('/serverstatus', function (req, res) {
  //console.log('Ber om serverns bygg info');
  readServerstatusHTML();
  res.send(html);
});

app.get('/api/resources', function (req, res) {
  //console.log('Ber om sonar om info');
  res.send(sonar);
});

//\\d+/api/json/
app.get('/jenkins/view/kontroll/job/:job/api/json/', function (req, res) {
  //console.log('pollar jenkins');
  if (req.url.indexOf("release-10.1") > 0) {
    res.send(jenkinsBuilds);
  } else if (req.url.indexOf("release-11.0") > 0) {
    res.send(jenkinsBuilds1);
  } else {
    res.send(jenkinsBuilds);
  }
});

app.get('/jenkins/view/kontroll/job/:job/*', function (req, res) {
  //console.log('Ber om detaljerna från jenkins');
  if (req.url.indexOf("release-10.1") > 0) {
  res.send(jenkinsBuildDetails);
  } else if (req.url.indexOf("release-11.0") > 0) {
  res.send(jenkinsBuildDetails1);
  } else {
  res.send(jenkinsBuildDetails);
  }
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