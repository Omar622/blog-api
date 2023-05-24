# blog-api

This is Blog-Api created with node js (express).

# overview
* There are users can sign-up, log-in and log out.
* Send token when log-in.
* User can create blogs and comment.
* User can see and follow any other user.
  * see less data if not following the viewed user.
* User sees and comments on blogs of the users he follows only.

## API Endpoints

**index**

```
/log-in
 [POST]
/sign-up
 [POST]
```

**user**

```
/user
 [GET] (get all users)
/user/:id
 [GET] (get user with id - check authorization)
/user/:id/follow
 [GET] (follow user with id - check authentication)
```

**blog**

```
/blog
 [GET] (get all blogs - check authorization)
/blog/:id [GET]
 (get blog with id - check authorization)
/blog/create
 [POST] (create blog - check authorization)
/blog/:id/comment
 [GET] (get all comments on blog with id - check authorization)
/blog/:blogId/comment/:commentId
 [GET] (get comment with commentId on blog with blogId - check authorization)
/blog/:id/comment/create
 [POST] (make comment on blog with id - check authorization)

```

# Notes
Project uses dotenv library. If you willing to use this code assign these variables
<DB_CONNECTION_STR>, <ACCESS_TOKEN_SECRET> in .env file