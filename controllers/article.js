'use strict';

const Controller = require('./controller').Controller;
let instance = null;

class ArticleController extends Controller {

  constructor(server, model) {
    super();

    if(!instance) {
      server.post('/article', this.create);
      server.get('/article/:id', this.getOne);
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
      .then(() => instance.isExist(req, 'title'))
      .then(() => instance.isExist(req, 'description'))
      .then(() => instance.isExist(req, 'text'))
      .then(() => instance.isExist(req, 'description_image'))
      .then(() => instance.model.filterAllowedFields(req.body))
      .then(article => instance.model.create(article))
      .then(article => res.send(article))
      .catch(err => res.send(err))
  }

  getOne(req, res) {
    res.end('get /article/:id');
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