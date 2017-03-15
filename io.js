let io = require('socket.io');

exports.register = function(server, options, next) {
  io = io(server.listener, {
    log: true
  });
  io.set('origins', '*:*');
  io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('message', function (message) {
      console.log('message received', message.type);
      socket.emit('message', message);
      socket.broadcast.emit('message', message);
    });
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });
  next();
};

exports.register.attributes = {
  name: 'io'
};
