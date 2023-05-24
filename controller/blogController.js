const authHelper = require('../authHelper');
const Blog = require('../models/blog');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.blog_create_post = [
  body('content')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('content must be specified.'),
  authHelper.authenticateToken,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return req.status(400).json({ message: "invalid input" })
    const new_blog = new Blog({
      author: req.userId,
      content: req.body.content,
    });
    await Promise.all([
      new_blog.save(),
      User.updateOne({ _id: req.userId }, { $push: { blogs: new_blog.id } })
    ])
    res.json({ message: "success" });
  })
];

exports.blog_list_get = [];

exports.blog_detail_get = [];

exports.comment_list_get = [];

exports.comment_create_post = [];

exports.comment_detail_get = [];
