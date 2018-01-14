'use strict';

const bcypt = require('bcrypt');
const error = require('restify-errors');

class PasswordHasher {

  hash(user) {
    return new Promise((resolve, reject) => {
      bcypt.hash(user.password, 10)
        .then(hash => {
          user.password = hash;
          resolve(user);
        })
        .catch(err => reject(err));
    });
  }

  compare(password, hash) {
    return new Promise((resolve, reject) => {
      bcypt.compare(password, hash)
        .then(result => {
          return result
            ? resolve()
            : reject(new error.UnauthorizedError('Wrong username or password'))
        })
    })
  }
}

module.exports = new PasswordHasher();