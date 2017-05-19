module.exports.setup = setup;
module.exports.client = getClient;

const debug = require('debug')('junk:server:redis');
const redis = require('sistemium-redis').default;

function setup() {

  var config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DATABASE
  };

  var client = redis.setup(config);

  client.on('connect', function() {
    debug('Connected');
  });

  return client;
}

function getClient() {
  return redis;
}
