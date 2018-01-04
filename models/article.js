'use strict';

const Model = require('./model').Model;

class Article extends Model {

  constructor(db) {
    super(db, [
      'title', 'description', 'text',
      'description_image', 'images', 'categories', 'tags'
    ]);
  }

  create(article) {
    return new Promise((resolve, reject) => {
      this.db.collection('articles')
        .insertOne(article)
        .then(result => {
          return result && result.insertedId
            ? resolve(article)
            : reject(new this.error.InternalServerError('Database error'));
        })
        .catch(err => reject(err))
    })
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.db.collection('articles')
        .findOne({
          _id: this.ObjectID.createFromHexString(id)
        })
        .then(article => {
          return article
            ? resolve(article)
            : reject(new this.error.InternalServerError('Database error'));
        })
        .catch(err => reject(err))
    })
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