'use strict';

const Model = require('./model').Model;

class User extends Model {

  constructor(db) {
    super(db, [
      'username', 'password', 'first_name', 'last_name', 'avatar'
    ]);
  }

}

module.exports = {
  user: User
};