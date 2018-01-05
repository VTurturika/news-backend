'use strict';

const Model = require('./model').Model;

class Category extends Model {

  constructor(db) {
    super(db)
  }

}

module.exports = {
  category: Category
};