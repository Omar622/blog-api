const authHelper = require('../authHelper');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.user_list_get = [

];

exports.user_detail_get = [
  authHelper.authenticateToken,
  asyncHandler(async (req, res) => {
    const currentUser = await User.findOne({ _id: req.userId }, 'following').exec();
    if (currentUser.following.includes(req.params.id)) {
      const user = await User.findOne({ _id: req.params.id },
        'first_name last_name name date_of_birth date_of_creation blogs following')
        .populate('following', '_id first_name last_name').populate('blogs', '_id').exec();
      return res.json({
        'name': user.name,
        'date_of_birth': user.date_of_birth,
        'joined': user.date_of_birth,
        'blogs': user.blogs,
        'following': user.following
      });
    } else {
      const user = await User.findOne({ _id: req.params.id },
        'first_name last_name name date_of_birth date_of_creation').exec();
      return res.json({
        'name': user.name,
        'date_of_birth': user.date_of_birth,
        'joined': user.date_of_birth,
      });
    }
  })
];