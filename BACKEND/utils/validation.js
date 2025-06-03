const { body, validationResult } = require('express-validator');

// Handle validation results
exports.validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Register validation
exports.registerValidation = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Login validation
exports.loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Create task validation
exports.createTaskValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed']).withMessage('Status must be todo, in-progress, or completed'),
  body('dueDate')
    .optional()
    .isISO8601().toDate().withMessage('Please provide a valid date')
];

// Update task validation
exports.updateTaskValidation = [
  body('title')
    .optional()
    .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed']).withMessage('Status must be todo, in-progress, or completed'),
  body('dueDate')
    .optional()
    .isISO8601().toDate().withMessage('Please provide a valid date')
];

// Update status validation
exports.updateStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['todo', 'in-progress', 'completed']).withMessage('Status must be todo, in-progress, or completed')
];
