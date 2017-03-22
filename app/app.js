var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var serverStatus = require('./serverstatus/serverstatus.js');

var socket = null

server.listen(80);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  this.socket = socket;
  socket.emit('serverstatus', { hello: 'world' });

  socket.on('my other event', function(data) {
    console.log(data);
  });

});

var poll = () => {

  setTimeout(function() {
    serverStatus.fetchBuildStatus().then(result => {
      if (socket) {
      	socket.emit('serverstatus', result)
      }
      poll();
    });
  }, 5000);

}


poll();