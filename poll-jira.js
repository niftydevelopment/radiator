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

var fetchit function(builds) {

  return new Promise(function(resolve, reject) {
  
    client.post("https://etjanst.sjv.se/jira/rest/auth/1/session", loginArgs, function(data, response) {
      if (response.statusCode == 200) {
        console.log('succesfully logged in, session:', data.session);
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
        // Make the request return the search results, passing the header information including the cookie.
        client.post("https://etjanst.sjv.se/jira/rest/api/2/issue/PCAP-17054", searchArgs, function(searchResult, response) {
            console.log('status code:', response.statusCode);
            console.log('search result:', searchResult);
            resolve(searchResult);
        });
      } else {
        reject('Login failed :(');
      }
    });

  });

  

}

exports.getTicketPlanedVersion = fetchit;
