# REST API

Entities:
- [Article](#article)

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