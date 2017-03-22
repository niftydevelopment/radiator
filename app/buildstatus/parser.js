var Promise = require('promise');

var decorate = function(builds) {
  //console.log('Parser: decorate', builds.length);
  
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  return new Promise(function(resolve, reject) {
  	
  	builds.forEach(function(b) {
  		if (b.msg.substring(b.msg.indexOf('PCAP-')) === -1) {
  			return;
  		}

      b.jira = b.msg.substring(b.msg.indexOf('PCAP-') + 5);
      
      var x = b.jira.match(/\D/)[0];
      var jiraNumber = b.jira.substring(0, b.jira.indexOf(x))

      if (isNumeric(jiraNumber)) {
        b.jira = 'PCAP-' + jiraNumber;
      } else {
        b.jira = null;
      }
  	});

  	resolve(builds);
  });

}

exports.decorate = decorate;