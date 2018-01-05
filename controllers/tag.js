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
   res.send('GET /tag');
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