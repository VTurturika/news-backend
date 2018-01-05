'use strict';

const Controller = require('./controller').Controller;
let instance = null;

class TagController extends Controller {

  constructor(server, model) {
    super();

    if(!instance) {
      server.get('/tag', this.getAll);
      server.put('/tag/:tagName', this.change);
      server.del('/tag/:tagName', this.del);
      this.model = model;

      instance = this;
    }
    return instance;
  }

  getAll(req, res) {
    Promise.resolve()
      .then(() => instance.model.getAll())
      .then(result => res.send(result))
      .catch(err => res.send(err));
  }

  change(req, res) {
    Promise.resolve()
      .then(() => instance.isExistParam(req, 'tagName'))
      .then(tagName => instance.model.find(tagName))
      .then(() => instance.isExistField(req, 'newName'))
      .then(() => instance.model.change(req.params.tagName, req.body.newName))
      .then(result => res.send(result))
      .catch(err => res.send(err));
  }

  del(req, res) {
    Promise.resolve()
      .then(() => instance.isExistParam(req, 'tagName'))
      .then(tagName => instance.model.find(tagName))
      .then(tagName => instance.model.del(tagName))
      .then(result => res.send(result))
      .catch(err => res.send(err));
  }
}

module.exports = {
  tag: TagController
};