module.exports = {
  findAll: findAll,
  save: save
};

const uuid = require('uuid');

const store = [];

function findAll() {
  return store;
}

function save(message) {

  Object.assign(message, {
    id: uuid.v4(),
    date: new Date()
  });

  store.splice(0, 0, message);

  if (store.length > 50) {
    store.pop();
  }

  return message;

}
