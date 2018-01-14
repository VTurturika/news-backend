'use strict';

const Model = require('./model').Model;

class Category extends Model {

  constructor(db) {
    super(db)
  }

  getAll(parent) {
    return new Promise((resolve, reject) => {
      let pipeline = [];

      if(parent) {
        pipeline.push({
          $match: {
            $or: [
              {_id: parent},
              {ancestors: parent}
            ]
          }
        })
      }
      pipeline.push({$addFields: {level: {$size: "$ancestors"}}});
      pipeline.push({$sort: {level: 1}});

      this.db.collection('categories')
        .aggregate(pipeline)
        .toArray()
        .then(categories => {
          let tree = [];
          categories.forEach(category => this.addToTree(tree, category));
          resolve(tree);
        })
        .catch(err => reject(err))
    })
  }

  addToTree(tree, node) {
    let root = tree;

    node.ancestors.forEach(ancestor => {
      root.find(item => {
        if(item.name === ancestor) {
          root = item.children;
          return true;
        }
      })
    });

    node.name = node._id;
    delete node._id;
    node.children = [];
    root.push(node);
  }
}

module.exports = {
  category: Category
};