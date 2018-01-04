'use strict';

const error = require('restify-errors');

class Model {

  constructor(db, allowedFields) {
    this.db = db;
    this.error = error;
    this.allowedFields = allowedFields;
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
}

module.exports = {
  Model: Model
};