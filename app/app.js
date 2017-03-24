var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var serverStatus = require('./serverstatus/serverstatus.js');
var buildStatus = require('./buildstatus/buildstatus.js');


var socket_ = null

var startup = true;
var savedResult = null;

var buildStartup = true;
var savedBuildResult = null;

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


var poll = () => {

  if (startup) {
    console.log('startup:', getFormattedDate());
    serverStatus.fetch().then(result => {
      if (socket_) {

        console.log('socket.emit(serverstatus, result):', getFormattedDate());

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
    serverStatus.fetch().then(result => {
      if (socket_) {

        console.log('socket.emit(serverstatus, result):', getFormattedDate());

        socket_.emit('serverstatus', result);
        savedResult = result;
      } else {
        console.log('socket is null');
      }
      poll();
    });
  }, 100000);

}


function getFormattedDate() {
  var date = new Date();
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return str;
}


var pollBuild = () => {

  if (buildStartup) {

    console.log('startup pollBuild:', getFormattedDate());

    buildStatus.fetchBuildStatus().then(result => {
      console.log('buildstatus:', result);

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
  }, 100000);




}



poll();
pollBuild();
