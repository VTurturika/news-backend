'use strict';

module.exports = {

  database: {
    endpoint: process.env.ENDPOINT || 'mongodb://localhost:27017',
    name: process.env.name || 'news'
  },

  server: {
    port: process.env.PORT || 8080
  }
};