var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var serverStatus = require('./serverstatus/serverstatus.js');

var socket_ = null

server.listen(9000);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  
  console.log('onConnection');

  socket_ = socket;
  socket.on('my other event', function(data) {
    console.log(data);
  });

});

var poll = () => {
  setTimeout(function() {
    serverStatus.fetchBuildStatus().then(result => {

      if (socket_) {
        console.log('socket.emit(serverstatus, result):', { hello: 'world' });
      	socket_.emit('serverstatus', result)
      } else {
        console.log('socket is null');
      }
      poll();
    });
  }, 5000);

}


poll();