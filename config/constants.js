'use strict';

module.exports = {

  database: {
    endpoint: process.env.ENDPOINT || 'mongodb://localhost:27017',
    name: process.env.name || 'news'
  },

  server: {
    port: process.env.PORT || 8080
  },

  jwt: {
    secret: process.env.SECRET || 'super secret',
    expiresIn: 60*60, //1h
    allowedRoutes: {
      '/article/:id': 'GET',
      '/article': 'GET',
      '/category/:id': 'GET',
      '/category/subtree/:id': 'GET',
      '/category': 'GET',
      '/tag': 'GET',
      '/user/signup': 'POST',
      '/user/login': 'POST'
    }
  }
};