'use strict';

const Controller = require('./controller').Controller;
let instance = null;

class ArticleController extends Controller {

  constructor(server, model) {
    super();

    if(!instance) {
      server.post('/article', this.create);
      server.get('/article/:id', this.get);
      server.get('/article', this.getAll);
      server.put('/article/:id', this.update);
      server.del('/article/:id', this.del);
      this.model = model;

      instance = this;
    }
    return instance;
  }

  create(req, res) {
    Promise.resolve()
      .then(() => instance.isExistField(req, 'title'))
      .then(() => instance.isExistField(req, 'description'))
      .then(() => instance.isExistField(req, 'text'))
      .then(() => instance.isExistField(req, 'description_image'))
      .then(() => instance.model.filterAllowedFields(req.body))
      .then(article => instance.model.create(article))
      .then(article => res.send(article))
      .catch(err => res.send(err))
  }

  get(req, res) {
    Promise.resolve()
      .then(() => instance.isExistParam(req, 'id'))
      .then(id => instance.model.validateId(req.params.id))
      .then(id => instance.model.get(id))
      .then(article => res.send(article))
      .catch(err => res.send(err));
  }

  getAll(req, res) {
    Promise.resolve()
      .then(() => instance.model.getArticles())
      .then(articles => res.json(articles))
      .catch(err => res.json(err));
  }

  update(req, res) {
    res.end('put /article/:id');
  }

  del(req, res) {
    res.end('delete /article/:id');
  }
}

module.exports = {
  article: ArticleController
};