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

  isAllowedRoute(req) {
    let route = req.getRoute();
    return instance.allowedRoutes[route.path] &&
      instance.allowedRoutes[route.path] === route.method;
  }

  extractToken(req) {
    return new Promise((resolve, reject) => {
      let token = null;
      if(req && req.headers && req.headers.authorization) {
        token = req.headers.authorization.match(/^Bearer (\S+)$/);
        token = token[1] ? token[1] : null;
      }
      return token
        ? resolve(token)
        : reject(new error.UnauthorizedError('Token required'))
    });
  }

  verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, instance.secret, (err, decoded) => {
        if(err) {
          reject(err)
        }
        else if(!decoded._id) {
          reject(new error.UnauthorizedError('Invalid token'))
        }
        else {
          resolve({
            token: token,
            _id: decoded._id
          })
        }
      })
    });
  }

  verifyRefreshToken(refreshToken, suffix) {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, instance.secret + suffix, err => {
        if(err) {
          reject(new error.UnauthorizedError('Invalid token or refreshToken'));
        }
        else {
          resolve()
        }
      })
    })
  }

  generateTokens(payload) {
    payload.iat = Math.floor(Date.now() / 1000);
    payload.exp = Math.floor(Date.now() / 1000) + this.expiresIn;
    let token = jwt.sign(payload, this.secret);
    let refreshToken = jwt.sign({}, this.secret + token);
    return {
      token: token,
      refreshToken: refreshToken,
      startedAt: new Date(payload.iat * 1000).toLocaleString(),
      finishedAt: new Date(payload.iat*1000 + this.expiresIn*1000).toLocaleString()
    }
  }
}

module.exports = new JwtService(constants.jwt);