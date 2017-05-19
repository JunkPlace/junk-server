const app = require('./config/express');
const debug = require('debug')('junk:server');
const http = require('http');
const redis = require('./config/redis');

redis.setup();

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || 3000;
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Set up socket engine
 */

const socketEngine = require('socket.io')(server, {
  serveClient: false,
  path: '/socket.io'
});

require('./config/socket')(socketEngine);


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {

  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
