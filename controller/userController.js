const authHelper = require('../authHelper');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

exports.user_list_get = asyncHandler(async (req, res) => {
  const users = await User.find({},
    'first_name last_name name date_of_birth date_of_creation').exec();
  const usersInfo = users.map((user) => ({
    'name': user.name,
    'date_of_birth': user.date_of_birth,
    'joined': user.date_of_creation,
  }));
  return res.json(usersInfo);
});

exports.user_detail_get = [
  authHelper.authenticateToken,
  asyncHandler(async (req, res) => {
    const currentUser = await User.findOne({ _id: req.userId }, 'following').exec();
    if (currentUser.following.includes(req.params.id)) {
      const user = await User.findOne({ _id: req.params.id },
        'first_name last_name name date_of_birth date_of_creation blogs following')
        .populate('following', '_id first_name last_name').exec();
      return res.json({
        'name': user.name,
        'date_of_birth': user.date_of_birth,
        'joined': user.date_of_creation,
        'blogs': user.blogs,
        'following': user.following
      });
    } else {
      const user = await User.findOne({ _id: req.params.id },
        'first_name last_name name date_of_birth date_of_creation').exec();
      return res.json({
        'name': user.name,
        'date_of_birth': user.date_of_birth,
        'joined': user.date_of_creation,
      });
    }
  })
];