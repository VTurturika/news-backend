'use strict';

const Controller = require('./controller').Controller;
let instance = null;

class CategoryController extends Controller {

  constructor(server, model) {
    super();

    if(!instance) {
      server.post('/category', this.create);
      server.get('/category/:id', this.get);
      server.get('/category/subtree/:id', this.getWithSubtree);
      server.get('/category', this.getAll);
      server.put('/category/:id', this.update);
      this.model = model;

      instance = this;
    }
    return instance;
  }

  getAll(req, res) {
    Promise.resolve()
      .then(() => instance.model.getAll())
      .then(categories => res.send(categories))
      .catch(err => res.send(err));
  }

  get(req, res) {
    Promise.resolve()
      .then(() => instance.isExistParam(req, 'id'))
      .then(id => instance.model.validateId(id))
      .then(id => instance.model.get(id))
      .then(category => res.send(category))
      .catch(err => res.send(err));
  }

  getWithSubtree(req, res) {
    Promise.resolve()
      .then(() => instance.isExistParam(req, 'id'))
      .then(id => instance.model.validateId(id))
      .then(id => instance.model.get(id))
      .then(() => instance.model.getAll(req.params.id))
      .then(category => res.send(category))
      .catch(err => res.send(err));
  }

  create(req, res) {
    Promise.resolve()
      .then(() => instance.isExistField(req, 'name'))
      .then(() => instance.isExistField(req, 'parent'))
      .then(() => instance.model.create(req.body))
      .then(category => res.send(category))
      .catch(err => res.send(err))
  }

  update(req, res) {
    Promise.resolve()
      .then(() => instance.isExistParam(req, 'id'))
      .then(id => instance.model.validateId(id))
      .then(id => instance.model.get(id))
      .then(() => instance.isExistField(req, 'name'))
      .then(() => instance.model.update(req.params.id, req.body.name))
      .then(category => res.send(category))
      .catch(err => res.send(err))
  }

}

module.exports = {
  category: CategoryController
};