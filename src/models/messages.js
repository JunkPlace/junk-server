module.exports = {
  findAll: findAll,
  save: save
};

const uuid = require('uuid');
const redis = require('../config/redis').client();

function findAll() {
  return redis.lrangeJson('messages', 0, 50);
}

function save(message) {

  Object.assign(message, {
    id: uuid.v4(),
    date: new Date()
  });

  redis.lpushJson('messages', message)
    .then(trim);

  return message;

}


function trim() {
  return redis.ltrim('messages', 0, 500);
}
