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
      Promise.resolve()
        .then(() => this.get(id)) // try to get article
        .then(article => this.db.collection('articles') //update article
          .updateOne({
              _id: this.ObjectID.createFromHexString(id)
            },
            Article.prepareForUpdate(newData, article)
          )
        )
        .then(response => {
          return response && response.result && response.result.ok
            ? this.get(id)
            : reject(new this.error.InternalServerError('Article not updated'))
        })
        .then(article => resolve(article)) //return updated article
        .catch(err => reject(err))
    })
  }

  static prepareForUpdate(newData, article) {

    if(newData.tags) { //need update tags

      let tags = Article.arrayToObject(article.tags);

      if(newData.tags.add &&
        Array.isArray(newData.tags.add) &&
        newData.tags.add.length > 0 &&
        newData.tags.add.every(tag => typeof tag === 'string')
      ) {
        newData.tags.add.forEach(tag => tags[tag] = true) //add tags
      }

      if(newData.tags.remove &&
        Array.isArray(newData.tags.remove) &&
        newData.tags.remove.length > 0 &&
        newData.tags.remove.every(tag => typeof tag === 'string')
      ) {
        newData.tags.remove.forEach(tag => delete tags[tag]) //remove tags
      }

      newData.tags = Object.keys(tags); //set merged tags
    }

    return {$set: newData};
  }

  static arrayToObject(array) {
    return array.reduce((result, item) => {
      result[item] = true;
      return result;
    }, {})
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