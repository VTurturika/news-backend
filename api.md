# REST API

## Article

| Action | Method | Endpoint |
| ----------- | ------ | -------- |
| [Create new article](#create-new-article) | POST | /article |

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

##### Response
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