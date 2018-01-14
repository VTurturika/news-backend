# REST API

Entities:
- [Article](#article)
- [Tag](#tag)
- [Category](#category)

## Article

| Action | Method | Endpoint |
| ----------- | ------ | -------- |
| [Create new article](#create-new-article) | POST | /article |
| [Get article by id](#get-article-by-id) | GET | /article/:id |
| [Update article by id](#update-article-by-id) | PUT | /article/:id |
| [Delete article by id](#delete-article-by-id) | DELETE | /article/:id |

### Create new article
#### Query
#### Request
```javascript
{
    "title": "Article title", //required
    "description": "Article description", //required
    "text": "Article text", //required
    "description_image": "image url", //required
    "image": "image_url",
    "categories": [],
    "tags": []
}
```

#### Response
* 200
```javascript
{
    "_id": "id_string"
    "title": "Article title",
    "description": "Article description",
    "text": "Article text", //required
    "description_image": "image url",
    "image": "image_url",
    "categories": [],
    "tags": []
}
```
* 400
```javascript
{
  "message": "BadRequest"
}
```

### Get article by id
#### Query
#### Request
#### Response
* 200
```javascript
{
    "_id": "id_string"
    "title": "Article title",
    "description": "Article description",
    "text": "Article text", //required
    "description_image": "image url",
    "image": "image_url",
    "categories": [],
    "tags": []
}
```
* 400
```javascript
{
  "message": "BadRequest"
}
```
* 404
```javascript
{
    "code": "NotFound",
    "message": "Article not found"
}
```

### Update article by id
#### Query
#### Request
```javascript
{
    "title": "New title",
    "description": "New description",
    "text": "New text",
    "description_image": "image url",
    "image": "image_url",
    "tags": {
        "add": ["1", "2", "3"],
        "remove": ["4"]
    },
    "categories": {
        "add": ["1", "2", "3"],
        "remove": ["4", "5"]
    }
}
```

#### Response
* 200
```javascript
{
    "_id": "id_string"
    "title": "New title",
    "description": "New description",
    "text": "New text",
    "description_image": "image url",
    "image": "image_url"
    "categories": [],
    "tags": []
}
```
* 400
```javascript
{
  "message": "BadRequest"
}
```
* 404
```javascript
{
    "code": "NotFound",
    "message": "Article not found"
}
```

### Delete article by id
#### Query
#### Request
#### Response
* 200
```javascript
{
    "_id": "id_string"
    "title": "Article title",
    "description": "Article description",
    "text": "Article text", //required
    "description_image": "image url",
    "image": "image_url",
    "categories": [],
    "tags": []
}
```
* 400
```javascript
{
  "message": "BadRequest"
}
```
* 404
```javascript
{
    "code": "NotFound",
    "message": "Article not found"
}
```

## Tag

| Action | Method | Endpoint |
| ----------- | ------ | -------- |
| [Get all tags](#get-all-tags) | GET | /tag |
| [Change tag](#change-tag) | PUT | /tag/:tagName |
| [Delete tag](#delete-tag) | DELETE | /tag/:tagName |

### Get all tags
#### Query
#### Request
#### Response
* 200
```javascript
{
   "tags": ["1", "2", "3"]
}
```

### Change tag
#### Query
#### Request
```javascript
{
    "newName": "new name for tag"
}
```

#### Response
* 200
```javascript
{
    "oldName": "old name of tag",
    "changedArticles": 123
}
```
* 400
```javascript
{
  "message": "BadRequest"
}
```
* 404
```javascript
{
    "code": "NotFound",
    "message": "Tag not found"
}
```

### Delete tag
#### Query
#### Request

#### Response
* 200
```javascript
{
    "oldName": "old name of tag"
    "changedArticles": 123
}
```
* 400
```javascript
{
  "message": "BadRequest"
}
```
* 404
```javascript
{
    "code": "NotFound",
    "message": "Tag not found"
}
```

## Category

| Action | Method | Endpoint |
| ----------- | ------ | -------- |
| [Get categories](#get-categories) | GET | /category |
| [Get category by name](#get-category-by-name) | GET | /category/:name |

### Get categories
#### Query
```javascript
    parent=name_of_parent //optional
```
#### Request

#### Response
* 200
```javascript
[
    {
        "ancestors": [],
        "parent": null,
        "level": 0,
        "name": "node1",
        "children": [
            {
                "ancestors": [
                    "node1"
                ],
                "parent": "node1",
                "level": 1,
                "name": "node2",
                "children": [
                    {
                        "ancestors": [
                            "node1",
                            "node2"
                        ],
                        "parent": "node2",
                        "level": 2,
                        "name": "node3",
                        "children": []
                    },
                    {
                        "ancestors": [
                            "node1",
                            "node2"
                        ],
                        "parent": "node2",
                        "level": 2,
                        "name": "node4",
                        "children": []
                    }
                ]
            }
        ]
    }
]
```

### Get category by name
#### Query
#### Request

#### Response
* 200
```javascript
{
    "ancestors": [
        "Node1",
        "Node2"
    ],
    "parent": "Node2",
    "name": "Node3"
}
```
* 404
```javascript
{
    "code": "NotFound",
    "message": "Category not found"
}
```