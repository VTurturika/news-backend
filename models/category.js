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

  update(id, newName) {
    return new Promise((resolve, reject) => {
      this.db.collection('categories')
        .updateOne({
          _id: this.createId(id)
        }, {
          $set: {name: newName}
        })
        .then(response => {
          return response && response.result && response.result.ok
            ? this.get(id)
            : reject(new this.error.InternalServerError('Category not updated'))
        })
        .then(category => resolve(category)) //return updated category
        .catch(err => reject(err));
    });
  }

  del(category) {
    return new Promise((resolve, reject) => {
      Promise.resolve()
        .then(() => this.db.collection('categories')
          .updateMany({ //update parent reference for direct children
            parent: category._id
          }, {
            $set: {parent: category.parent}
          })
        )
        .then(response => {
          return response && response.result && response.result.ok
            ? this.db.collection('categories')
              .updateMany({ //remove id from all ancestors arrays
                ancestors: category._id
              }, {
                $pull: {ancestors: category._id}
              })
            : reject(new this.error.InternalServerError(
              "Can't update parent reference for direct children"
            ))
        })
        .then(response => {
          return response && response.result && response.result.ok
            ? this.db.collection('categories')
              .deleteOne({ //finally delete category
                _id: category._id
              })
            : reject(new this.error.InternalServerError(
              "Can't delete occurrences of id Ancestors arrays"
            ))
        })
        .then(response => {
          return response && response.deletedCount
            ? resolve(category)
            : reject(new this.error.InternalServerError("Can't delete category"))
        })
        .catch(err => reject(err));
    });
  }

}

module.exports = {
  category: Category
};