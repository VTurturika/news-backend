'use strict';

const Model = require('./model').Model;

class Tag extends Model {

  constructor(db) {
    super(db);
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.db.collection('articles')
        .aggregate([
          { $unwind: "$tags" },
          { $group: {_id: null, tags: {$addToSet: "$tags"}} }
        ])
        .toArray()
        .then(response => {

          let result = {tags: []};
          if(response.length > 0) {
            delete response[0]._id;
            result = response[0];
          }
          resolve(result);
        })
        .catch(err => reject(err))
    });
  }

  find(tagName) {
    return new Promise((resolve, reject) => {
      this.db.collection('articles')
        .findOne({
          tags: tagName
        })
        .then(article => {
          return article
            ? resolve(tagName)
            : reject(new this.error.NotFoundError('Tag not found'));
        })
        .catch(err => reject(err))
    })
  }

  change(oldName, newName) {
    return new Promise((resolve, reject) => {
      this.db.collection('articles')
        .updateMany({
          tags: oldName
        },{
          $addToSet: {tags: newName}
        })
        .then(response => {
          return response && response.result && response.result.ok
            ? this.del(oldName)
            : reject(new this.error.InternalServerError('Tag not changed'))
        })
        .then(result => resolve(result))
        .catch(err => reject(err))
    });
  }

  del(tagName) {
    return new Promise((resolve, reject) => {
      this.db.collection('articles')
        .updateMany({
          tags: tagName
        }, {
          $pull: {tags: tagName}
        })
        .then(response => {
          return response && response.modifiedCount
            ? resolve({
              oldName: tagName,
              changedArticles: response.modifiedCount
            })
            : reject(new this.error.InternalServerError('Tag not deleted'))
        })
    })
  }

}

module.exports = {
  tag: Tag
};