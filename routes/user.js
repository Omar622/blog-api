const userController = require('../controller/userController');
const express = require('express');
const router = express.Router();

router.get('/', userController.user_list_get);

router.get('/:id', userController.user_detail_get);

module.exports = router;
