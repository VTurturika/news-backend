# REST API

Entities:
- [Article](#article)
- [Tag](#tag)
- [Category](#category)
- [User](#user)

## Article

| Action | Method | Endpoint |
| ----------- | ------ | -------- |
| [Create new article](#create-new-article) | POST | /article |
| [Get article by id](#get-article-by-id) | GET | /article/:id |
| [Update article by id](#update-article-by-id) | PUT | /article/:id |
| [Delete article by id](#delete-article-by-id) | DELETE | /article/:id |

### Create new article
#### Auth
Authorization: Bearer <jwt token>
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
* 401
```javascript
{
    "code": "Unauthorized",
    "message": "Access forbidden"
}
```

### Get article by id
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
#### Auth
Authorization: Bearer <jwt token>
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
* 401
```javascript
{
    "code": "Unauthorized",
    "message": "Access forbidden"
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
#### Auth
Authorization: Bearer <jwt token>
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
* 401
```javascript
{
    "code": "Unauthorized",
    "message": "Access forbidden"
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
#### Response
* 200
```javascript
{
   "tags": ["1", "2", "3"]
}
```

### Change tag
#### Auth
Authorization: Bearer <jwt token>
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
* 401
```javascript
{
    "code": "Unauthorized",
    "message": "Access forbidden"
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
#### Auth
Authorization: Bearer <jwt token>
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
* 401
```javascript
{
    "code": "Unauthorized",
    "message": "Access forbidden"
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
| [Add new category](#add-new-category) | POST | /category |
| [Get categories](#get-categories) | GET | /category |
| [Get category](#get-category) | GET | /category/:id |
| [Get category with subtree](#get-category-with-subtree) | GET | /category/subtree/:id |
| [Update category name](#update-category-name) | PUT | /category/:id |
| [Delete category](#delete-category) | DELETE | /category/:id |

### Add category
#### Auth
Authorization: Bearer <jwt token>
#### Request
```javascript
{
    "name": "Category name", //required
    "parent": "Parent id" //required
}
```

#### Response
* 200
```javascript
{

    "_id": "id",
    "name": "Category name",
    "parent": "Parent id",
    "ancestors": [
        "Ancestor 1 id",
        "Ancestor 2 id",
        // ...
        "Parent id"
    ]
}
```
* 400
```javascript
{
  "message": "BadRequest"
}
```
* 401
```javascript
{
    "code": "Unauthorized",
    "message": "Access forbidden"
}
```

### Get categories

#### Response
* 200
```javascript
[
    {
        "_id": "id",
        "ancestors": [],
        "parent": null,
        "level": 0,
        "name": "node1",
        "children": [
            {
                "_id": "id",
                "ancestors": [
                    "node1 id"
                ],
                "parent": "node1 id",
                "level": 1,
                "name": "node2",
                "children": [
                    {
                        "_id": "id",
                        "ancestors": [
                            "node1 id",
                            "node2 id"
                        ],
                        "parent": "node2 id",
                        "level": 2,
                        "name": "node3",
                        "children": []
                    },
                    {
                        "_id": "id",
                        "ancestors": [
                            "node1 id",
                            "node2 id"
                        ],
                        "parent": "node2 id",
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
* 400
```javascript
{
  "message": "BadRequest"
}
```

### Get category

#### Response
* 200
```javascript
{
    "_id": "id",
    "ancestors": [
        "node1 id",
        "node2 id"
    ],
    "parent": "node2 id",
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

### Get category with subtree

#### Response
* 200
```javascript
{
    "_id": "id",
    "ancestors": [],
    "parent": null,
    "level": 0,
    "name": "node1",
    "children": [
        {
            "_id": "id",
            "ancestors": [
                "node1 id"
            ],
            "parent": "node1 id",
            "level": 1,
            "name": "node2",
            "children": [
                {
                    "_id": "id",
                    "ancestors": [
                        "node1 id",
                        "node2 id"
                    ],
                    "parent": "node2 id",
                    "level": 2,
                    "name": "node3",
                    "children": []
                },
                {
                    "_id": "id",
                    "ancestors": [
                        "node1 id",
                        "node2 id"
                    ],
                    "parent": "node2 id",
                    "level": 2,
                    "name": "node4",
                    "children": []
                }
            ]
        }
    ]
}
```
* 404
```javascript
{
    "code": "NotFound",
    "message": "Category not found"
}
```

### Update category name
#### Auth
Authorization: Bearer <jwt token>
#### Request
```javascript
{
  "name": "New category name"
}
```

#### Response
* 200
```javascript
{
    "_id": "id",
    "ancestors": [
        "node1 id",
        "node2 id"
    ],
    "parent": "node2 id",
    "name": "New name"
}
```
* 400
```javascript
{
  "message": "BadRequest"
}
```
* 401
```javascript
{
    "code": "Unauthorized",
    "message": "Access forbidden"
}
```
* 404
```javascript
{
    "code": "NotFound",
    "message": "Category not found"
}
```

### Delete category
#### Auth
Authorization: Bearer <jwt token>
#### Response
* 200
```javascript
{
    "_id": "id",
    "ancestors": [
        "node1 id",
        "node2 id"
    ],
    "parent": "node2 id",
    "name": "Node3"
}
```
* 401
```javascript
{
    "code": "Unauthorized",
    "message": "Access forbidden"
}
```
* 404
```javascript
{
    "code": "NotFound",
    "message": "Category not found"
}
```

## User

| Action | Method | Endpoint |
| ----------- | ------ | -------- |
| [Signup](#signup) | POST | /user/signup |
| [Login](#login) | POST | /user/login |
| [Logout](#logout) | POST | /user/logout |
| [Get all users](#get-all-users) | GET | /user |
| [Update user](#update-user) | PUT | /user/:id |
| [Delete user](#delete-user) | DELETE | /user/:id |

### Signup
#### Request
```javascript
{
	"username": "username",
	"password": "12345",
	"firstname": "first name",
	"lastname": "last name"
}
```

#### Response
* 200
```javascript
{
    "_id": "user id",
    "username": "username",
    "firstname": "first name",
    "lastname": "last name",
    "finishedAt": "2018-01-20T14:09:40.197Z",
    "refreshToken": "jwt refresh token",
    "startedAt": "2018-01-20T13:09:40.197Z",
    "token": "jwt token"
}
```
* 400
```javascript
{
    "code": "BadRequest",
    "message": "User already exist"
}
```

### Login
#### Request
```javascript
{
	"username": "username",
	"password": "12345"
}
```

#### Response
* 200
```javascript
{
    "_id": "user id",
    "username": "username",
    "firstname": "first name",
    "lastname": "last name",
    "finishedAt": "2018-01-20T14:09:40.197Z",
    "refreshToken": "jwt refresh token",
    "startedAt": "2018-01-20T13:09:40.197Z",
    "token": "jwt token"
}
```
* 401
```javascript
{
    "code": "Unauthorized",
    "message": "Wrong username or password"
}
```

### Logout
#### Auth
Authorization: Bearer <jwt token>

#### Response
* 200
```javascript
{
    "code": "OK"
}
```
* 401
```javascript
{
    "code": "Unauthorized",
    "message": "Access forbidden"
}
```
* 404
```javascript
{
    "code": "NotFound",
    "message": "User not found"
}
```

### Get all users

#### Response
* 200
```javascript
[
    {
        "_id": "user id",
        "username": "username"
    }
]
```

### Update user
#### Auth
Authorization: Bearer <jwt token>
#### Request
```javascript
{
	"firstname": "dedlewd",
	"lastname": "ddwedewde",
	"password": "new password"
}
```

#### Response
* 200
```javasript
{
    "_id": "user id",
    "username": "username",
    "firstname": "first name",
    "lastname": "last name",
    "finishedAt": "2018-01-20T14:09:40.197Z",
    "refreshToken": "jwt refresh token",
    "startedAt": "2018-01-20T13:09:40.197Z",
    "token": "jwt token"
}
```
* 401
```javascript
{
    "code": "Unauthorized",
    "message": "Access forbidden"
}
```
* 404
```javascript
{
    "code": "NotFound",
    "message": "User not found"
}
```

### Delete user
#### Auth
Authorization: Bearer <jwt token>

#### Response
* 200
```javasript
{
    "_id": "user id",
    "username": "username",
    "firstname": "first name",
    "lastname": "last name",
    "finishedAt": "2018-01-20T14:09:40.197Z",
    "refreshToken": "jwt refresh token",
    "startedAt": "2018-01-20T13:09:40.197Z",
    "token": "jwt token"
}
```
* 401
```javascript
{
    "code": "Unauthorized",
    "message": "Access forbidden"
}
```
* 404
```javascript
{
    "code": "NotFound",
    "message": "User not found"
}
```
