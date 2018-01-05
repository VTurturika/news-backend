'use strict';

const Controller = require('./controller').Controller;
let instance = null;

class CategoryController extends Controller {

  constructor(server, model) {
    super();

    if(!instance) {
      server.get('/category', this.getAll);
      this.model = model;

      instance = this;
    }
    return instance;
  }

  getAll(req, res) {
    res.send('GET /category');
  }

}

module.exports = {
  category: CategoryController
};