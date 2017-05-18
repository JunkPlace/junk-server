module.exports = config;

const uuid = require('uuid');
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

  console.info(
    'CONNECTED',
    'id:', socket.id,
    'address:', ip(socket)
  );

  socket.number = ++counter;

  socket.on('post', function (text, ack) {

    console.info('post', 'socket:', socket.id, 'data:', JSON.stringify(text));

    var message = messages.save({
      id: uuid.v4(),
      from: '#' + socket.number,
      text: text,
      date: new Date()
    });

    socket.broadcast.emit('message', message);

    if (typeof ack === 'function') {
      ack(message);
    }

  });

  socket.emit('welcome', messages.findAll());

}