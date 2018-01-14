'use strict';

const Controller = require('./controller').Controller;
let instance = null;

class UserController extends Controller {

  constructor(server, model) {
    super();

    if(!instance) {
      server.post('/user/signup', this.signUp);
      server.post('/user/login', this.login);
      server.post('/user/logout', this.logout);
      server.put('/user/:id', this.update);
      server.del('/user/:id', this.del);
      this.model = model;

      instance = this;
    }
    return instance;
  }

  signUp(req, res) {
    res.end('signUp');
  }

  login(req, res) {
    res.end('login');
  }

  logout(req, res) {
    res.end('logout');
  }

  update(req, res) {
    res.end('update');
  }

  del(req, res) {
    res.end('del');
  }

}

module.exports = {
  user: UserController
};