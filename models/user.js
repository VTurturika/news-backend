'use strict';

const Model = require('./model').Model;

class User extends Model {

  constructor(db) {
    super(db, [
      'username', 'password', 'firstname', 'lastname'
    ]);

    this.jwt = require('../services/jwt');
    this.password = require('../services/password');
  }

  checkIfExist(username) {
    return new Promise((resolve, reject) => {
      this.db.collection('users')
        .findOne({
          username: username
        })
        .then(user => {
          return !user
            ? resolve()
            : reject(new this.error.BadRequestError('User already exist'))
        })
        .catch(err => reject(err));
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.db.collection('users')
        .findOne({
          _id: this.createId(id)
        })
        .then(user => {
          return user
            ? resolve(this.hidePassword(user))
            : reject(new this.error.NotFoundError('User not found'))
        })
        .catch(err => reject(err));
    });
  }

  create(user) {
    return new Promise((resolve, reject) => {
      Promise.resolve()
        .then(() => this.password.hash(user))
        .then(user => this.db.collection('users').insertOne(user))
        .then(response => {
          return response && response.insertedId
            ? this.startSession(response.insertedId.toHexString())
            : reject(new this.error.InternalServerError('User not created'))
        })
        .then(user => resolve(user))
        .catch(err => reject(err));
    });
  }

  login(user) {
    return new Promise((resolve, reject) => {
      let id = null;
      Promise.resolve()
        .then(() => this.db.collection('users').findOne({username: user.username}))
        .then(dbUser => {
          if(dbUser) {
            id = dbUser._id.toHexString();
            return this.password.compare(user.password, dbUser.password)
          }
          return reject(new this.error.UnauthorizedError('Wrong username or password'))
        })
        .then(() => this.startSession(id))
        .then(user => resolve(user))
        .catch(err => reject(err));
    });
  }

  refreshToken(user, request) {
    return new Promise((resolve, reject) => {
      Promise.resolve()
        .then(() => this.jwt.verifyRefreshToken(request.refreshToken, user.token))
        .then(() => {
          let id = user._id.toHexString();
          return user.token === request.token && user.refreshToken === request.refreshToken
            ? this.startSession(id)
            : reject(new this.error.InternalServerError('Tokens are different'))
        })
        .then(user => resolve(user))
        .catch(err => reject(err))
    });
  }

  logout(user) {
    return new Promise((resolve, reject) => {
      user.token = user.refreshToken = '';
      user.finishedAt = new Date().toISOString();
      this.db.collection('users')
        .updateOne({
          _id: user._id
        },{
          $set: user
        })
        .then(response => {
          return response && response.result && response.result.ok
            ? resolve()
            : reject(new this.error.InternalServerError('User not logged out'))
        })
        .catch(err => reject(err))
    })
  }

  startSession(id) {
    return new Promise((resolve, reject) => {
      let tokens = this.jwt.generateTokens({_id: id});
      this.db.collection('users')
        .updateOne({
          _id: this.createId(id)
        }, {
          $set: tokens
        })
        .then(response => {
          return response && response.modifiedCount
            ? this.get(id)
            : reject(new this.error.InternalServerError('Login failed'))
        })
        .then(user => resolve(user))
        .catch(err => reject(err))
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.db.collection('users')
        .find()
        .project({username: 1})
        .toArray()
        .then(users => {
          return users
            ? resolve(users)
            : reject()
        })
    });
  }

  update(id, user) {
    return new Promise((resolve, reject) => {
      delete user.username;
      Promise.resolve()
        .then(() => {
          return Object.keys(user).length === 0
            ? reject(new this.error.BadDigestError('Invalid request body'))
            : this.password.hash(user)
        })
        .then(user => this.db.collection('users')
          .updateOne({
            _id: this.createId(id)
          }, {
            $set: user
          }))
        .then(response => {
          return response && response.result && response.result.ok
            ? this.get(id)
            : reject(new this.error.InternalServerError('User not updated'))
        })
        .then(user => resolve(user))
        .catch(err => reject(err));
    })
  }

  del(user) {
    return new Promise((resolve, reject) => {
      this.db.collection('users')
        .deleteOne({
          _id: user._id
        })
        .then(response => {
          return response && response.deletedCount
            ? resolve(user)
            : reject(new this.error.InternalServerError("User not deleted"))
        })
        .catch(err => reject(err));
    })
  }
}

module.exports = {
  user: User
};