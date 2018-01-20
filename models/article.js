'use strict';

const Model = require('./model').Model;

class Article extends Model {

  constructor(db) {
    super(db, [
      'title', 'description', 'text',
      'description_image', 'image', 'categories', 'tags'
    ]);
  }

  create(article, userId) {
    article.user = userId;
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
    let article = null;
    return new Promise((resolve, reject) => {
      this.db.collection('articles')
        .findOne({
          _id: this.createId(id)
        })
        .then(dbArticle => {
          if(dbArticle && dbArticle.user && dbArticle.categories) {
            article = dbArticle;
            return Promise.all([
              this.getAuthor(dbArticle.user),
              this.getCategories(dbArticle.categories)
            ])
          }
          return reject(new this.error.NotFoundError('Article not found'))
        })
        .then(results => {
          article.user = results[0];
          article.categories = results[1];
          resolve(article);
        })
        .catch(err => reject(err))
    })
  }

  getAuthor(userId) {
    return new Promise((resolve, reject) => {
      this.db.collection('users')
        .findOne({
          _id: this.createId(userId)
        })
        .then(user => resolve(this.hidePassword(user)))
        .catch(err => reject(err))
    });
  }

  getCategories(categories) {
    return new Promise((resolve, reject) => {
      categories.forEach((category, i, arr) => {
        arr[i] = this.createId(category);
      });
      this.db.collection('categories')
        .find({
          _id: {$in: categories}
        })
        .toArray()
        .then(categories => resolve(categories))
        .catch(err => reject(err));
    });
  }

  update(id, newData) {
    return new Promise((resolve, reject) => {
      Promise.resolve()
        .then(() => this.get(id)) // try to get article
        .then(article => this.db.collection('articles') //update article
          .updateOne({
              _id: this.createId(id)
            },
            this.prepareForUpdate(newData, article)
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

  prepareForUpdate(newData, article) {

    if(newData.tags) { //need update tags
      let tags = this.arrayToObject(article.tags);

      if(newData.tags.add && this.isArrayOfStrings(newData.tags.add)) {
        newData.tags.add.forEach(tag => tags[tag] = true);
      }

      if(newData.tags.remove && this.isArrayOfStrings(newData.tags.remove)) {
        newData.tags.remove.forEach(tag => delete tags[tag])
      }
      newData.tags = Object.keys(tags);
    }

    if(newData.categories) { //need update categories
      let categories = this.arrayToObject(article.categories);

      if(newData.categories.add && this.isArrayOfStrings(newData.categories.add)) {
        newData.categories.add.forEach(category => categories[category] = true)
      }

      if(newData.categories.remove && this.isArrayOfStrings(newData.categories.remove)) {
        newData.categories.remove.forEach(category => delete categories[category])
      }
      newData.categories = Object.keys(categories);
    }

    return {$set: newData};
  }

  del(id) {
    return new Promise((resolve, reject) => {
      let article;
      Promise.resolve()
        .then(() => this.get(id))
        .then(result => {
          article = result;
          return this.db.collection('articles')
            .deleteOne({
              _id: article._id
            })
        })
        .then(response => {
          return response && response.deletedCount
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