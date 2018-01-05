'use strict';

const Model = require('./model').Model;

class Tag extends Model {

  constructor(db) {
    super(db, []);
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

}

module.exports = {
  tag: Tag
};