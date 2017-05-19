module.exports = config;

const debug = require('debug')('junk:server:socket');
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
  debug('DISCONNECTED', 'id:', socket.id, 'address:', ip(socket));
}

function onConnect(socket) {

  debug('CONNECTED', 'id:', socket.id, 'address:', ip(socket));

  socket.number = ++counter;
  socket.on('post', onPost);
  socket.on('setUser', onSetUser);

  messages.findAll()
    .then(function (lastMessages)  {
      socket.emit('welcome', lastMessages)
    });

  function onPost(text, ack) {

    debug('post', 'socket:', socket.id, 'data:', JSON.stringify(text));

    var message = messages.save({
      authorId: socket.userId,
      from: '#' + socket.number,
      text: text
    });

    socket.broadcast.emit('message', message);

    if (typeof ack === 'function') {
      ack(message);
    }

  }

  function onSetUser(userId) {
    debug('setUser', userId);
    socket.userId = userId;
  }

}

