const { body } = require('express-validator');

const existsErr = 'field is required!';
const usernameLengthErr = 'must be between 5 and 30 characters.';
const usernameAlphaNumErr = 'must only contain letters and numbers.';
const nameAlphaErr = 'must only contain letters.';
const nameLengthErr = 'must be between 1 and 25 characters.';
const emailErr = 'Must be a valid email address.';
const passLengthErr = 'must be between 8 and 32 characters.';
const passMatchErr = 'Passwords must match.';

module.exports.validateLogin = [
  body('username')
    .exists({ values: 'undefined' | 'null' })
    .withMessage(`Username ${existsErr}`)
    .trim(),
  body('password')
    .exists({ values: 'undefined' | 'null' })
    .withMessage(`Password ${existsErr}`)
    .trim(),
];

module.exports.validateUser = [
  body('username')
    .exists({ values: 'undefined' | 'null' })
    .withMessage(`Username ${existsErr}`)
    .trim()
    .isLength({ min: 5, max: 30 })
    .withMessage(`Username ${usernameLengthErr}`)
    .isAlphanumeric()
    .withMessage(`Username ${usernameAlphaNumErr}`),
  body('email').optional().trim().isEmail().withMessage(emailErr),
  body('firstname')
    .optional()
    .trim()
    .isAlpha()
    .withMessage(`First name ${nameAlphaErr}`)
    .isLength({ min: 1, max: 25 })
    .withMessage(`First name ${nameLengthErr}`),
  body('lastname')
    .optional()
    .trim()
    .isAlpha()
    .withMessage(`Last name ${nameAlphaErr}`)
    .isLength({ min: 1, max: 25 })
    .withMessage(`Last name ${nameLengthErr}`),
  body('password')
    .exists({ values: 'undefined' | 'null' })
    .withMessage(`Password ${existsErr}`)
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(`Password ${passLengthErr}`),
  body('confirmPassword')
    .exists({ values: 'undefined' | 'null' })
    .withMessage(`Confirm password ${existsErr}`)
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage(passMatchErr),
];

module.exports.validatePost = [
  body('title')
    .exists({ values: 'undefined' | 'null' })
    .withMessage(`Title ${existsErr}`)
    .trim()
    .isLength({ min: 5, max: 30 })
    .withMessage(`Title ${usernameLengthErr}`),
  body('subtitle')
    .optional()
    .trim()
    .isLength({ min: 5, max: 30 })
    .withMessage(`Subtitle ${usernameLengthErr}`),
  body('content')
    .exists({ values: 'undefined' | 'null' })
    .withMessage(`Main content ${existsErr}`)
    .trim(),
];

module.exports.validateComment = [
  body('content')
    .exists({ values: 'undefined' | 'null' })
    .withMessage(`Comment content ${existsErr}`)
    .trim(),
  body('postId')
    .exists({ values: 'undefined' | 'null' })
    .withMessage(`Post ID ${existsErr}`)
    .trim(),
];
