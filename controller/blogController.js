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

exports.blog_list_get = [
  authHelper.authenticateToken,
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.userId }, 'following')
      .populate({
        path: 'following',
        select: 'blogs first_name last_name name',
        populate: { path: 'blogs' }
      }).exec();
    const blogs = [];
    user.following.forEach(follow => {
      follow.blogs.forEach(blog => {
        blogs.push({
          '_id': blog._id,
          'author': follow.name,
          'content': blog.content,
          'date_of_creation': blog.date_of_creation,
        })
      });
    });

    return res.json({ blogs });
  })
];

exports.blog_detail_get = [
  authHelper.authenticateToken,
  asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ _id: req.params.id });
    if (blog.author.toString() === req.userId) {
      return res.json({ blog });
    } else {
      const user = await User.findOne({ _id: req.userId }, 'following').exec();
      if (user.following.includes(blog.author)) {
        return res.json({ blog });
      } else {
        return res.status(401).json({ message: "couldn't access" });
      }
    }
  })
];

exports.comment_list_get = [];

exports.comment_create_post = [];

exports.comment_detail_get = [];
