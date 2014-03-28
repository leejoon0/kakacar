//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');  
var routes = require('./routes');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var app = express();


app.configure(function(){  
    app.set('port', process.env.PORT || 3000);  
    app.set('views', __dirname + '/views');  
    app.set('view engine', 'ejs');  
    app.use(express.favicon());  
    app.use(express.logger('dev')); 
    app.use(express.bodyParser());  
    app.use(express.methodOverride());  
    app.use(express.cookieParser());
    app.use(express.session({
        secret: '<h1>WHEEYEEE</h1>',
        key: 'crossfit',
        cookie: {
          secret: true,
          expires: false
        }
      }));
    app.use(app.router);  
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
        
require('./routes')(app);

if (require.main === module) {
    
    http.createServer(app).listen(app.get('port'), function(){
       console.log("Express server listening on port %d in %s mode", app.get('port'));
    });
}
else {
  console.info('Running app as a module')
  exports.app = app;
    
}

/*
var server = http.createServer(app);
var io = socketio.listen(server);

app.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

*/
