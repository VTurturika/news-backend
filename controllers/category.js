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
    Promise.resolve()
      .then(() => instance.isExistQueryParam(req, 'parent'))
      .then(parent => instance.model.getAll(parent))
      .then(categories => res.send(categories))
      .catch(err => res.send(err));
  }

}

module.exports = {
  category: CategoryController
};