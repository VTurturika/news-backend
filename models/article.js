'use strict';

const Model = require('./model').Model;

class Article extends Model {

  constructor(db) {
    super(db, [
      'title', 'description', 'text',
      'description_image', 'images', 'categories', 'tags'
    ]);
  }

  getArticles() {
    return new Promise((resolve, reject) => {
      this.db.collection('articles')
        .find()
        .toArray()
        .then(data => resolve(data))
        .catch(err => reject(err))
    });
  }
}

module.exports = {
  article: Article
};