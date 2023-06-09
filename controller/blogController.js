const authHelper = require('../authHelper');
const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
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

exports.comment_list_get = [
  authHelper.authenticateToken,
  asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ _id: req.params.id }, 'author comments')
      .populate('comments', 'content date_of_creation');

    if (blog.author.toString() === req.userId) {
      return res.json({ comments: blog.comments });
    } else {
      const user = await User.findOne({ _id: req.userId }, 'following').exec();
      if (user.following.includes(blog.author)) {
        return res.json({ comments: blog.comments });
      } else {
        return res.status(401).json({ message: "couldn't access" });
      }
    }
  })
];

exports.comment_create_post = [
  body('content')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('content must be specified.'),
  authHelper.authenticateToken,
  asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ _id: req.params.id });
    const newComment = new Comment({
      content: req.body.content,
      author: req.userId,
      blog: blog._id,
    });
    if (blog.author.toString() === req.userId) {
      await Promise.all([
        newComment.save(),
        Blog.updateOne({ _id: req.params.id }, { $push: { comments: newComment._id } })
      ]);
      return res.json({ message: 'success' });
    } else {
      const user = await User.findOne({ _id: req.userId }, 'following').exec();
      if (user.following.includes(blog.author)) {
        await Promise.all([
          newComment.save(),
          Blog.updateOne({ _id: req.params.id }, { $push: { comments: newComment._id } })
        ]);
        return res.json({ message: 'success' });
      } else {
        return res.status(401).json({ message: "couldn't access" });
      }
    }
  })
];

exports.comment_detail_get = [
  authHelper.authenticateToken,
  asyncHandler(async (req, res) => {
    let blog, comment;
    [blog, comment] = await Promise.all([
      Blog.findOne({ _id: req.params.blogId }),
      comment = await Comment.findOne({ _id: req.params.commentId }),
    ]);

    if (!blog.comments.includes(req.params.commentId))
      return res.status(400).json({ message: "invalid input" });

    if (blog.author.toString() === req.userId) {
      return res.json({ comment });
    } else {
      const user = await User.findOne({ _id: req.userId }, 'following').exec();
      if (user.following.includes(blog.author)) {
        return res.json({ comment });
      } else {
        return res.status(401).json({ message: "couldn't access" });
      }
    }
  })
];
