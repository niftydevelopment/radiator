var Client = require('node-rest-client').Client;

client = new Client();
var Promise = require('promise');

var loginArgs = {
  data: {
    "username": "",
    "password": ""
  },
  headers: {
    "Content-Type": "application/json"
  }
};

var login = function() {
  //console.log('login');
  return new Promise(function(resolve, reject) {

    var baseurl = 'https://etjanst.sjv.se/';
    if (process.env.MOCK) {
      baseurl = 'http://localhost:3000/'
    }

    var loginUrl = baseurl + 'jira/rest/auth/1/session';

    //console.log(loginUrl);

    client.post(loginUrl, loginArgs, function(data, response) {
      
      if (response.statusCode == 200) {

        var session = data.session;
        // Get the session information and store it in a cookie in the header
        var searchArgs = {
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

        //console.log('succesfully logged in, session:', data.session);
        resolve(session);

      } else {
        reject('Login failed :(');
      }
    });

  });

}

var getJiraInfo = function(build) {
  //console.log('getJiraInfo');
  
  return new Promise(function(resolve, reject) {

    var baseurl = 'https://etjanst.sjv.se/';
    if (process.env.MOCK) {
      baseurl = 'http://localhost:3000/'
    }

    //console.log(baseurl + "jira/rest/api/2/issue/PCAP-17054");

    // Make the request return the search results, passing the header information including the cookie.
    client.get(baseurl + "jira/rest/api/2/issue/PCAP-17054", function(searchResult, response) {
        //console.log('search result:', searchResult);
        build.jiraPlannedForVersion = 'version 123';
        //console.log('search result:', build.jira);
        
        resolve(build);
    });

  });

}

var decorate = function(builds) {

  return new Promise(function(resolve, reject) {

    login().then(function() {

      var decoratedBuilds = [];

      builds.forEach(function(b) {
        decoratedBuilds.push(getJiraInfo(b));  
      });

      Promise.all(decoratedBuilds).then(function(result) {
        resolve(builds);
      });
            

    });

  });

}

exports.decorate = decorate;