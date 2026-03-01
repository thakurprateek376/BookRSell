const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Register validation rules
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain only letters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and numbers'),
  
  body('city')
    .trim()
    .notEmpty().withMessage('City is required')
    .isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  
  body('role')
    .optional()
    .isIn(['buyer', 'seller']).withMessage('Role must be buyer or seller')
];

// Login validation rules
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Add book validation rules
const validateAddBook = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  
  body('author')
    .trim()
    .notEmpty().withMessage('Author is required')
    .isLength({ min: 2, max: 50 }).withMessage('Author name must be 2-50 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 1 }).withMessage('Price must be greater than 0'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Engineering', 'Medical', 'Science', 'Arts', 'Commerce', 'Others'])
    .withMessage('Invalid category'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  
  body('condition')
    .optional()
    .isIn(['Like New', 'Very Good', 'Good', 'Fair']).withMessage('Invalid condition')
];

// Update profile validation rules
const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain only letters'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits')
];

// Search validation
const validateSearch = [
  body('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query too long'),
  
  body('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Min price must be >= 0'),
  
  body('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Max price must be >= 0')
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateAddBook,
  validateUpdateProfile,
  validateSearch
};
