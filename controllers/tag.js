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
    res.send(`PUT /tag/:${req.params.tagName}`)
  }

  del(req, res) {
    res.send(`DELETE /tag/:${req.params.tagName}`)
  }
}

module.exports = {
  tag: TagController
};