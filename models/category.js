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
              {_id: this.createId(parent)},
              {ancestors: this.createId(parent)}
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
          resolve(parent ? tree[0]: tree);
        })
        .catch(err => reject(err))
    })
  }

  addToTree(tree, node) {
    let root = tree;

    node.ancestors.forEach(ancestor => {
      root.find(item => {
        if(ancestor.equals(item._id)) {
          root = item.children;
          return true;
        }
      })
    });

    node.children = [];
    root.push(node);
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.db.collection('categories')
        .findOne({
          _id: this.createId(id)
        })
        .then(category => {
          return category
            ? resolve(category)
            : reject(new this.error.NotFoundError('Category not found'))
        })
        .catch(err => reject(err))
    })
  }

  create(category) {
    return new Promise((resolve, reject) => {
      if(category.parent === null) { //add to root
        category.ancestors = [];
        this.db.collection('categories').insertOne(category)
          .then(response => {
            return response && response.insertedId
              ? resolve(category)
              : reject(new this.error.InternalServerError('Category not created'))
          })
          .catch(err => reject(err))
      }
      else {
        Promise.resolve()
          .then(() => this.validateId(category.parent))
          .then(() => this.get(category.parent)) //find parent
          .then(parent => {
            category.parent = this.createId(category.parent);
            category.ancestors = parent.ancestors;
            category.ancestors.push(category.parent);
            return this.db.collection('categories').insertOne(category)
          })
          .then(response => {
            return response && response.insertedId
              ? resolve(category)
              : reject(new this.error.InternalServerError('Category not created'))
          })
          .catch(err => reject(err))
      }
    });
  }
}

module.exports = {
  category: Category
};