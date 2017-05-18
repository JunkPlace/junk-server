module.exports = config;

const messages = require('../models/messages');

var counter = 0;

function ip(socket) {
  return socket.handshake.headers['x-real-ip'] || socket.handshake.address;
}

function config(socketEngine) {

  socketEngine.on('connection', function (socket) {

    socket.connectedAt = new Date();

    socket.on('disconnect', function () {
      onDisconnect(socket);
    });

    onConnect(socket);

  });

}

function onDisconnect(socket) {

  console.info(
    'DISCONNECTED',
    'id:', socket.id,
    'address:', ip(socket)
  );

}

function onConnect(socket) {

  console.info('CONNECTED', 'id:', socket.id, 'address:', ip(socket));

  socket.number = ++counter;
  socket.on('post', onPost);
  socket.emit('welcome', messages.findAll());

  function onPost(text, ack) {

    console.info('post', 'socket:', socket.id, 'data:', JSON.stringify(text));

    var message = messages.save({
      from: '#' + socket.number,
      text: text
    });

    socket.broadcast.emit('message', message);

    if (typeof ack === 'function') {
      ack(message);
    }

  }

}

