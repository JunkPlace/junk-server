module.exports = config;

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

  socket.on('info', function (data, ack) {

    console.info('info:', 'id:', socket.id, 'data:', JSON.stringify(data));

    socket.broadcast.emit('message', {
      from: socket.number,
      text: data
    });

    if (typeof ack === 'function') {
      ack('Hi there!');
    }

  });

}