'use strict';

const Model = require('./model').Model;

class Jwt extends Model {

  constructor(db) {
    super(db);
  }

  checkSession(verified) {
    return new Promise((resolve, reject) => {
      this.db.collection('users')
        .findOne({
          _id: this.createId(verified._id)
        })
        .then(user => {
          if(!user) {
            reject(new this.error.UnauthorizedError('User not found'))
          }
          else if(user.token !== verified.token) {
            reject(new this.error.UnauthorizedError('Invalid token'))
          }
          else {
            resolve(verified._id);
          }
        })
    })
  }
}

module.exports = {
  jwt: Jwt
};