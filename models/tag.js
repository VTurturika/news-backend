'use strict';

const Model = require('./model').Model;

class Tag extends Model {

  constructor(db) {
    super(db, []);
  }

  getAll() {

  }

}

module.exports = {
  tag: Tag
};