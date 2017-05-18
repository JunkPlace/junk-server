module.exports = config;

const uuid = require('uuid');
var counter = 0;

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
    'address:', socket.handshake.address
  );

}


function onConnect(socket) {

  console.info(
    'CONNECTED',
    'id:', socket.id,
    'address:', socket.handshake.address
  );

  socket.number = ++counter;

  socket.on('post', function (data, ack) {

    console.info('post', 'socket:', socket.id, 'data:', JSON.stringify(data));

    var message = {
      id: uuid.v4(),
      from: '#' + socket.number,
      text: data,
      date: new Date()
    };

    socket.broadcast.emit('message', message);

    if (typeof ack === 'function') {
      ack(message);
    }

  });

}