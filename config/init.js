'use strict';

const entities = ['article', 'tag', 'category'];
const modelsDir = '../models/';
const controllersDir = '../controllers/';

function initDatabase(constants) {

  return new Promise((resolve, reject) => {
    const mongodb = require('mongodb').MongoClient;
    mongodb.connect(constants.database.endpoint)
      .then(conn => resolve(conn.db(constants.database.name)))
      .catch(err => reject(err));
  })
}

function initControllers(server, db) {

  return new Promise((resolve, reject) => {
    entities.forEach(entity => {
      let model = require(modelsDir + entity)[entity];
      let controller = require(controllersDir + entity)[entity];
      new controller(server, new model(db));
    });
    resolve();
  })
}

module.exports = {
  database: initDatabase,
  controllers: initControllers
};
