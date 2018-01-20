'use strict';

const error = require('restify-errors');

class Controller {

  isExistField(req, field) {
    return new Promise((resolve, reject) => {
      return req.body && req.body[field] !== undefined
        ? resolve(req.body[field])
        : reject(new error.BadRequestError(`field ${field} is required`))
    });
  }

  isExistParam(req, param) {
    return new Promise((resolve, reject) => {
      return req.params && req.params[param] !== undefined
        ? resolve(req.params[param])
        : reject(new error.BadRequestError(`param :${param} is required`))
    });
  }

  getQueryParam(req, param, out) {
    return new Promise(resolve => {
      if(req.query && req.query[param] !== undefined) {
        out[param] = req.query[param]
      }
      resolve();
    })
  }
}

module.exports = {
  Controller: Controller
};