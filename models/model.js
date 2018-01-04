'use strict';

const error = require('restify-errors');
const ObjectID = require('mongodb').ObjectID;

class Model {

  constructor(db, allowedFields) {
    this.db = db;
    this.error = error;
    this.allowedFields = allowedFields;
    this.ObjectID = ObjectID;
  }

  filterAllowedFields(rawData) {
    return new Promise((resolve, reject) => {
      let filteredData = {};
      this.allowedFields.forEach(field => {
        if(rawData && rawData[field] !== undefined) {
          filteredData[field] = rawData[field];
        }
      });
      return Object.keys(filteredData).length > 0
        ? resolve(filteredData)
        : reject(new this.error.BadRequestError('Invalid request body'))
    });
  }

  validateId(id) {
    return new Promise((resolve, reject) => {
      return this.ObjectID.isValid(id)
        ? resolve(id)
        : reject(new this.error.BadRequestError('id is invalid'))
    });
  }

}

module.exports = {
  Model: Model
};