'use strict';

const jwt = require('jsonwebtoken');
const error = require('restify-errors');
const constants = require('../config/constants');

let instance = null;

class JwtService {

  constructor(jwtConstants) {

    if(!instance) {
      this.secret = jwtConstants.secret;
      this.allowedRoutes = jwtConstants.allowedRoutes;
      this.expiresIn = jwtConstants.expiresIn;
      instance = this;
    }
    return instance;
  }

  handler(req, res, next) {
    if(instance.isAllowedRoute(req)) {
      return next();
    }
    else {
      let token = instance.extractToken(req);
      if(token && instance.verifyToken(token)) {
        return next();
      }
      res.send(new error.UnauthorizedError('Access forbidden'))
    }
  }

  isAllowedRoute(req) {
    let route = req.getRoute();
    return instance.allowedRoutes[route.path] &&
      instance.allowedRoutes[route.path] === route.method;
  }

  extractToken(req) {
    let token = null;
    if(req && req.headers && req.headers.authorization) {
      token = req.headers.authorization.match(/^Bearer (\S+)$/);
      token = token[1] ? token[1] : null;
    }
    return token;
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, instance.secret)
    }
    catch(err) {
      return false;
    }
  }

  generateTokens(payload) {

    payload.iat = Date.now();
    let token = jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn
    });
    let refreshToken = jwt.sign({}, this.secret + token)

    return {
      token: token,
      refreshToken: refreshToken,
      startedAt: new Date(payload.iat).toISOString(),
      finishedAt: new Date(payload.iat + 1000*this.expiresIn).toISOString()
    }
  }
}

module.exports = new JwtService(constants.jwt);