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
        .then(response => {
          return response && response.insertedId
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
        },
          Article.prepareForUpdate(newData)
        )
        .then(response => {
          return response && response.result && response.result.ok
            ? resolve(id)
            : reject(new this.error.InternalServerError('Article not updated'))
        })
        .catch(err => reject(err))
    })
  }

  static prepareForUpdate(newData) {

    let updateObject = {};

    if(newData.tags) { //need update tags

      if(newData.tags.add &&
        Array.isArray(newData.tags.add) &&
        newData.tags.add.length > 0 &&
        newData.tags.add.every(tag => typeof tag === 'string')
      ) {
        updateObject.$addToSet = {
          tags: {$each : newData.tags.add} //add tags
        }
      }

      if(newData.tags.remove &&
        Array.isArray(newData.tags.remove) &&
        newData.tags.remove.length > 0 &&
        newData.tags.remove.every(tag => typeof tag === 'string')
      ) {
        updateObject.$pullAll = {
          tags: newData.tags.remove //remove tags
        }
      }

      delete newData.tags;
    }
    updateObject.$set = newData;

    return updateObject;
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
            : reject(new this.error.InternalServerError('Article not deleted'));
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