const blogController = require('../controller/blogController');
const express = require('express');
const router = express.Router();

router.post('/create', blogController.blog_create_post);

router.get('/', blogController.blog_list_get);

router.get('/:id', blogController.blog_detail_get);

router.get('/:id/comment', blogController.comment_list_get);

router.post('/:id/comment/create', blogController.comment_create_post);

router.get('/:blogId/comment/:commentId', blogController.comment_detail_get);

module.exports = router;
