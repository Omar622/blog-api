const indexController = require('../controller/indexController');
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.json({ message: 'welcome to server' });
});

router.post('/sign-up', indexController.sign_up_user_post);

router.post('/login', indexController.log_in_user_post);

module.exports = router;
