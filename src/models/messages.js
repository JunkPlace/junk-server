module.exports = {
  findAll: findAll,
  save: save
};

const store = [];

function findAll() {
  return store;
}

function save(message) {

  store.splice(0, 0, message);

  if (store.length > 50) {
    store.pop();
  }

  return message;

}