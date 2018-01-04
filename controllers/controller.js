'use strict';

const error = require('restify-errors');

class Controller {

  isExist(req, field) {
    return new Promise((resolve, reject) => {
      return req.body && req.body[field] !== undefined
        ? resolve()
        : reject(new error.BadRequestError(`field ${field} is required`))
    });
  }
}

module.exports = {
  Controller: Controller
};