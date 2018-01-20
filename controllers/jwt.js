'use strict';

const Controller = require('./controller').Controller;
let instance = null;

class JwtController extends Controller {

  constructor(server, model) {
    super();

    if(!instance) {
      server.use(this.handler);
      this.model = model;
      this.jwt = require('../services/jwt');

      instance = this;
    }
    return instance;
  }

  handler(req, res, next) {
    if(instance.jwt.isAllowedRoute(req)) {
      return next();
    }
    else {
      Promise.resolve()
        .then(() => instance.jwt.extractToken(req))
        .then(token => instance.jwt.verifyToken(token))
        .then(verified => instance.model.checkSession(verified))
        .then(userId => {
          req.userId = userId;
          return next();
        })
        .catch(err => res.send(401, err));
    }
  }

}

module.exports = {
  jwt: JwtController
};

