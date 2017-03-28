var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var colors = require('colors');
var program = require('commander');
var Promise = require('promise');

var server = require('http').Server(app);
var io = require('socket.io')(server);

var serverStatus = require('./serverstatus/serverstatus.js');
var buildStatus = require('./buildstatus/buildstatus.js');

var socket_ = null

var startup = true;
var savedResult = null;

var buildStartup = true;
var savedBuildResult = null;



var init = function() {

  return new Promise(function(resolve, reject) {

    program
      .version('0.0.4')
      .description('AC 4 president!')
      .option('-n, --numberofbuilds <n>', 'Antal builds som skall visas')
      .option('-m, --mock', 'Kör mot mockat läge')
      .parse(process.argv);

    var OPTS = { n: 8, m: false };

    if (program.numberofbuilds) {
      OPTS.n = program.numberofbuilds;
    }

    if (program.mock) {
      OPTS.m = true;
      process.env['MOCK'] = OPTS;
    }

    console.log('Radiator startad:');
    if (process.env.MOCK) {
      console.log('  - i mockat läge :-)');
    }

    console.log('  - %j antal builds visas', program.numberofbuilds);

    resolve();

  });

}



server.listen(9000);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('onConnection');
  socket_ = socket;
  if (savedResult) {
    socket_.emit('serverstatus', savedResult);
  }
});

io.on('forserauppdatering', () => {
  console.log('forserauppdatering');
  startup = true;
  poll();
})


var poll = () => {
  //console.log('poll()');

  if (startup) {
    //console.log('poll() / startup', getFormattedDate());

    serverStatus.fetch().then(result => {
      //console.log('-----> serverStatus.fetch() result:', result);

      if (socket_) {


        socket_.emit('serverstatus', result);
        savedResult = result;
      } else {
        console.log('socket is null');
      }
      poll();
    });
    startup = false;
    return;
  }

  setTimeout(function() {
    
    serverStatus.fetch().then(r => {
      
      if (socket_) {
        savedResult = r;
        //console.log('socket.emit(serverstatus, result):', getFormattedDate());
        socket_.emit('serverstatus', r);
      } else {
        console.log('socket is null');
      }

      poll();

    });

  }, 600);

}


function getFormattedDate() {
  var date = new Date();
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return str;
}


var pollBuild = () => {
  console.log('startup pollBuild:', getFormattedDate());
  if (buildStartup) {

    console.log('startup pollBuild:', getFormattedDate());

    buildStatus.fetchBuildStatus().then(result => {
      //console.log('buildstatus:', result);

      if (socket_) {

        console.log('socket.emit(buildstatus, result):', getFormattedDate());

        socket_.emit('buildstatus', result);
        savedBuildResult = result;
      } else {
        console.log('socket is null');
      }
      poll();
    });
    buildStartup = false;
    return;
  }

  setTimeout(function() {
    buildStatus.fetchBuildStatus().then(result => {
      if (socket_) {

        console.log('socket.emit(buildstatus, result):', getFormattedDate());

        socket_.emit('buildstatus', result);
        savedBuildResult = result;
      } else {
        console.log('socket is null');
      }
      poll();
    });
  }, 10000);

}


init().then(() => {
  poll();
  //pollBuild();
});

init();
