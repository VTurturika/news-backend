'use strict';

const Model = require('./model').Model;

class Article extends Model {

  constructor(db) {
    super(db, [
      'title', 'description', 'text',
      'description_image', 'image', 'categories', 'tags'
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
            : reject(new this.error.NotFoundError('Article not found'));
        })
        .catch(err => reject(err))
    })
  }

  update(id, newData) {
    return new Promise((resolve, reject) => {
      this.db.collection('articles')
        .updateOne({
          _id: this.ObjectID.createFromHexString(id)
        },{
          $set: newData
        })
        .then(result => {
          return result && result.modifiedCount
            ? resolve(id)
            : reject(new this.error.InternalServerError('Not updated'))
        })
        .catch(err => reject(err))
    })
  }

  del(article) {
    return new Promise((resolve, reject) => {
      this.db.collection('articles')
        .deleteOne({
          _id: article._id
        })
        .then(result => {
          return result && result.deletedCount
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