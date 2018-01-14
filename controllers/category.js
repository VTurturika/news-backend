'use strict';

const Controller = require('./controller').Controller;
let instance = null;

class CategoryController extends Controller {

  constructor(server, model) {
    super();

    if(!instance) {
      server.get('/category', this.getAll);
      server.get('/category/:name', this.get);
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

  get(req, res) {
    Promise.resolve()
      .then(() => instance.isExistParam(req, 'name'))
      .then(name => instance.model.get(name))
      .then(category => res.send(category))
      .catch(err => res.send(err));
  }
}

module.exports = {
  category: CategoryController
};