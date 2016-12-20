var Promise = require('promise');

var decorate = function(builds) {
  //console.log('Parser: decorate', builds.length);
  
  return new Promise(function(resolve, reject) {
  	
  	builds.forEach(function(b) {
  		b.msg = ' lkasjdlkasj  PCAP-1234 lkfjdsfkjkl';
  		if (b.msg.substring(b.msg.indexOf('PCAP-')) === -1) {
  			return;
  		}

		b.jira = b.msg.substring(b.msg.indexOf('PCAP-'));
		b.jira = b.jira.substring(0, b.jira.indexOf(' '));
  	});

  	resolve(builds);
  });

}

exports.decorate = decorate;