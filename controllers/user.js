'use strict';

const Controller = require('./controller').Controller;
let instance = null;

class UserController extends Controller {

  constructor(server, model) {
    super();

    if(!instance) {
      server.post('/user/signup', this.signUp);
      server.post('/user/login', this.login);
      server.post('/user/refresh/:id', this.refreshToken);
      server.post('/user/logout/:id', this.logout);
      server.get('/user', this.getAll);
      server.put('/user/:id', this.update);
      server.del('/user/:id', this.del);
      this.model = model;

      instance = this;
    }
    return instance;
  }

  signUp(req, res) {
    Promise.resolve()
      .then(() => instance.isExistField(req, 'username'))
      .then(() => instance.isExistField(req, 'password'))
      .then(() => instance.isExistField(req, 'firstname'))
      .then(() => instance.isExistField(req, 'lastname'))
      .then(() => instance.model.checkIfExist(req.body.username))
      .then(() => instance.model.filterAllowedFields(req.body))
      .then(user => instance.model.create(user))
      .then(user => res.send(user))
      .catch(err => res.send(err));
  }

  login(req, res) {
    Promise.resolve()
      .then(() => instance.isExistField(req, 'username'))
      .then(() => instance.isExistField(req, 'password'))
      .then(() => instance.model.filterAllowedFields(req.body))
      .then(() => instance.model.login(req.body))
      .then(user => res.send(user))
      .catch(err => res.send(err));
  }

  refreshToken(req, res) {
    Promise.resolve()
      .then(() => instance.isExistParam(req, 'id'))
      .then(id => instance.model.validateId(id))
      .then(() => instance.isExistField(req, 'token'))
      .then(() => instance.isExistField(req, 'refreshToken'))
      .then(() => instance.model.get(req.params.id))
      .then(user => instance.model.refreshToken(user, req.body))
      .then(user => res.send(user))
      .catch(err => res.send(err));
  }

  logout(req, res) {
    Promise.resolve()
      .then(() => instance.isExistParam(req, 'id'))
      .then(id => instance.model.validateId(id))
      .then(id => instance.model.get(id))
      .then(user => instance.model.logout(user))
      .then(() => res.send({code: "OK"}))
      .catch(err => res.send(err));
  }

  update(req, res) {
    Promise.resolve()
      .then(() => instance.isExistParam(req, 'id'))
      .then(id => instance.model.validateId(id))
      .then(id => instance.model.get(id))
      .then(() => instance.model.filterAllowedFields(req.body))
      .then(user => instance.model.update(req.params.id, user))
      .then(user => res.send(user))
      .catch(err => res.send(err));
  }

  del(req, res) {
    Promise.resolve()
      .then(() => instance.isExistParam(req, 'id'))
      .then(id => instance.model.validateId(id))
      .then(id => instance.model.get(id))
      .then(user => instance.model.del(user))
      .then(user => res.send(user))
      .catch(err => res.send(err));
  }

  getAll(req, res) {
    Promise.resolve()
      .then(() => instance.model.getAll())
      .then(users => res.send(users))
      .catch(err => res.send(err));
  }
}

module.exports = {
  user: UserController
};