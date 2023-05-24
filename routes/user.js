const userController = require('../controller/userController');
const express = require('express');
const router = express.Router();

router.get('/', userController.user_list_get);

router.get('/:id', userController.user_detail_get);

router.post('/:id/follow', userController.user_follow_post);

module.exports = router;
