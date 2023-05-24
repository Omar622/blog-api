const blogController = require('../controller/blogController');
const express = require('express');
const router = express.Router();

router.get('/', blogController.blog_list_get);

router.post('/create', blogController.blog_create_post);

router.get('/:id', blogController.blog_detail_get);

module.exports = router;
