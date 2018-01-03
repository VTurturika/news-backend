'use strict';

const entities = ['article'];

function initDatabase(constants) {

  return new Promise((resolve, reject) => {
    const mongodb = require('mongodb').MongoClient;
    const url = 'mongodb://localhost:27017';
    mongodb.connect(url)
      .then(conn => resolve(conn.db(constants.database.name)))
      .catch(err => reject(err));
  })
}

function initControllers(server, db) {

  return new Promise((resolve, reject) => {
    entities.forEach(entity => {
      let model = require(`./models/${entity}`)[entity];
      let controller = require(`./controllers/${entity}`)[entity];
      new controller(server, new model(db));
    });
    resolve();
  })
}

module.exports = {
  database: initDatabase,
  controllers: initControllers
};
