const User = require('../models/user');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.sign_up_user_post = [
  body('email')
    .isEmail()
    .escape()
    .withMessage('must be email'),
  body('password')
    .isLength({ min: 6 })
    .escape()
    .withMessage('password must be at least 6 length'),
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('first name must be specified.'),
  body('last_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('first name must be specified.'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  // then process request
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const new_user = new User({
      email: req.body.email,
      password: hashedPassword,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
    });

    if (!errors.isEmpty()) {
      return res.status(400).json({
        new_user,
        errors: errors.array(),
      });
    } else {
      if (await User.exists({ email: new_user.email }).exec()) {
        return res.status(400).json({
          new_user,
          errors: 'This email already exists',
        });
      }
      await new_user.save();
      return res.json({ message: 'success' });
    }
  })
];

exports.log_in_user_post = [];