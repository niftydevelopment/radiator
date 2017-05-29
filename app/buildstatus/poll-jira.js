var Client = require('node-rest-client').Client;
var fs = require('fs');

client = new Client();
var Promise = require('promise');


var fetchJiraUser = function() {
  //console.log('Properties: fetch');

  return new Promise(function(resolve, reject) {

    fs.readFile('./app/properties/passwords.json', 'utf8', function (err, data) {
      var user = JSON.parse(data);
      resolve(user);
    });

  });

}



var loginArgs = {
  data: {
    "username": "dsin",
    "password": ""
  },
  headers: {
    "Content-Type": "application/json"
  }
};

var session = null;

var login = function(user) {
  //console.log('login', user);
  loginArgs.data = user;

  return new Promise(function(resolve, reject) {

    if (session != null) { //testa om anv redan är inloggad.
      var sa = constructSearchArgs(session);

      getJiraInfo(build.jira, sa).then(function() {
        resolve(sa);
        return;
      });

    }

    var baseurl = 'https://etjanst.sjv.se/';
    if (process.env.MOCK) {
      baseurl = 'http://localhost:3000/'
    }

    var loginUrl = baseurl + 'jira/rest/auth/1/session';

    //console.log(loginUrl);

    client.post(loginUrl, loginArgs, function(data, response) {

      if (response.statusCode == 200) {

        session = data.session;
        // Get the session information and store it in a cookie in the header
        var searchArgs = constructSearchArgs(session);

        //console.log('succesfully logged in, session:', data.session);
        resolve(searchArgs);

      } else {
        //console.log(data);
        reject('Login failed :(');
      }
    });

  });

}

var constructSearchArgs = function(session) {

  return {
    headers: {
      // Set the cookie from the session information
      cookie: session.name + '=' + session.value,
      "Content-Type": "application/json"
    },
    data: {
      // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
      jql: "type=Bug AND status=Closed"
    }
  };

}

var getJiraInfo = function(build, searchArgs) {
  //console.log('   Jira: getJiraInfo', build.jira);

  return new Promise(function(resolve, reject) {

    var baseurl = 'https://etjanst.sjv.se/';
    if (process.env.MOCK) {
      baseurl = 'http://localhost:3000/'
    }

    var url = baseurl + "jira/rest/api/2/issue/" + build.jira;
    //console.log('------------------->' , url);
    client.get(url, searchArgs,
      function(searchResult, response) {
        build.jiraPlannedForVersion = null;
        if (searchResult.fields && searchResult.fields.fixVersions && searchResult.fields.fixVersions.length > 0) {
          build.jiraPlannedForVersion = searchResult.fields.fixVersions[0].name;
        }
        resolve(build);
      });

  });

}

var decorate = function(builds) {
  //console.log('Jira: decorate', builds.length);

  return new Promise(function(resolve, reject) {

    fetchJiraUser().then(login).then(function(searchArgs) {

      var decoratedBuilds = [];

      builds.forEach(function(b) {
        decoratedBuilds.push(getJiraInfo(b, searchArgs));
      });

      Promise.all(decoratedBuilds).then(function(result) {
        resolve(builds);
      });


    }, function(error) {
      //console.log(error);
      resolve(builds);
    });

  });

}

var update = function(builds) {
  //console.log('Jira: update');
  //login
  //for each
  //update

  return new Promise(function(resolve, reject) {
    resolve(builds);
  });

}


exports.decorate = decorate;
exports.update = update;
