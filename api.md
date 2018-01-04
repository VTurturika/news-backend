# REST API

Entities:
- [Article](#article)

## Article

| Action | Method | Endpoint |
| ----------- | ------ | -------- |
| [Create new article](#create-new-article) | POST | /article |
| [Get article by id](#get-article-by-id) | GET | /article/:id |
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
    "images": ["url1", "url2"],
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
    "images": ["url1", "url2"],
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
    "images": ["url1", "url2"],
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
    "images": ["url1", "url2"],
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