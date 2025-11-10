import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { AppError } from './auth';

// Validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined
    }));
    
    throw new AppError(`Validation failed: ${errorMessages.map(e => e.message).join(', ')}`, 400);
  }
  
  next();
};

// Common validation rules
export const commonValidations = {
  // MongoDB ObjectId validation
  objectId: (field: string) => 
    param(field).isMongoId().withMessage(`${field} must be a valid MongoDB ObjectId`),
  
  // Email validation
  email: (field: string = 'email') =>
    body(field).isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  
  // Password validation
  password: (field: string = 'password') =>
    body(field)
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  // Required string validation
  requiredString: (field: string, minLength: number = 1) =>
    body(field)
      .trim()
      .isLength({ min: minLength })
      .withMessage(`${field} is required and must be at least ${minLength} characters long`),
  
  // Optional string validation
  optionalString: (field: string, maxLength?: number) => {
    const validation = body(field).optional().trim();
    if (maxLength) {
      validation.isLength({ max: maxLength }).withMessage(`${field} must not exceed ${maxLength} characters`);
    }
    return validation;
  },
  
  // Phone number validation
  phoneNumber: (field: string = 'phoneNumber') =>
    body(field)
      .optional()
      .isMobilePhone('any')
      .withMessage('Please provide a valid phone number'),
  
  // URL validation
  url: (field: string) =>
    body(field)
      .optional()
      .isURL()
      .withMessage(`${field} must be a valid URL`),
  
  // Date validation
  date: (field: string) =>
    body(field)
      .optional()
      .isISO8601()
      .toDate()
      .withMessage(`${field} must be a valid date`),
  
  // Number validation
  number: (field: string, min?: number, max?: number) => {
    let validation = body(field).isNumeric().withMessage(`${field} must be a number`);
    if (min !== undefined) {
      validation = validation.custom(value => {
        if (parseFloat(value) < min) {
          throw new Error(`${field} must be at least ${min}`);
        }
        return true;
      });
    }
    if (max !== undefined) {
      validation = validation.custom(value => {
        if (parseFloat(value) > max) {
          throw new Error(`${field} must not exceed ${max}`);
        }
        return true;
      });
    }
    return validation;
  },
  
  // Array validation
  array: (field: string, minLength?: number, maxLength?: number) => {
    let validation = body(field).isArray().withMessage(`${field} must be an array`);
    if (minLength !== undefined) {
      validation = validation.isLength({ min: minLength }).withMessage(`${field} must contain at least ${minLength} items`);
    }
    if (maxLength !== undefined) {
      validation = validation.isLength({ max: maxLength }).withMessage(`${field} must not contain more than ${maxLength} items`);
    }
    return validation;
  },
  
  // Enum validation
  enum: (field: string, allowedValues: string[]) =>
    body(field)
      .isIn(allowedValues)
      .withMessage(`${field} must be one of: ${allowedValues.join(', ')}`),
  
  // Boolean validation
  boolean: (field: string) =>
    body(field)
      .optional()
      .isBoolean()
      .withMessage(`${field} must be a boolean value`),
  
  // Pagination validation
  pagination: () => [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sortBy')
      .optional()
      .isString()
      .withMessage('SortBy must be a string'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('SortOrder must be either "asc" or "desc"')
  ]
};

// User validation rules
export const userValidations = {
  register: [
    commonValidations.requiredString('firstName', 2),
    commonValidations.requiredString('lastName', 2),
    commonValidations.email(),
    commonValidations.password(),
    commonValidations.enum('role', ['influencer', 'brand', 'agency']),
    commonValidations.phoneNumber(),
    handleValidationErrors
  ],
  
  login: [
    commonValidations.email(),
    commonValidations.requiredString('password'),
    handleValidationErrors
  ],
  
  updateProfile: [
    commonValidations.optionalString('firstName', 50),
    commonValidations.optionalString('lastName', 50),
    commonValidations.phoneNumber(),
    commonValidations.optionalString('bio', 500),
    commonValidations.url('website'),
    handleValidationErrors
  ],
  
  changePassword: [
    commonValidations.requiredString('currentPassword'),
    commonValidations.password('newPassword'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match new password');
        }
        return true;
      }),
    handleValidationErrors
  ]
};

// Campaign validation rules
export const campaignValidations = {
  create: [
    commonValidations.requiredString('campaignName', 3),
    commonValidations.requiredString('description', 10),
    commonValidations.enum('status', ['draft', 'active', 'paused', 'completed', 'cancelled']),
    commonValidations.date('startDate'),
    commonValidations.date('endDate'),
    commonValidations.number('budget', 0),
    commonValidations.array('targetAudience'),
    body('endDate').custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
    handleValidationErrors
  ],
  
  update: [
    commonValidations.objectId('id'),
    commonValidations.optionalString('campaignName', 3),
    commonValidations.optionalString('description', 10),
    commonValidations.enum('status', ['draft', 'active', 'paused', 'completed', 'cancelled']),
    commonValidations.date('startDate'),
    commonValidations.date('endDate'),
    commonValidations.number('budget', 0),
    handleValidationErrors
  ]
};

// Lead validation rules
export const leadValidations = {
  create: [
    commonValidations.requiredString('businessName', 2),
    commonValidations.requiredString('contactPerson', 2),
    commonValidations.email(),
    commonValidations.phoneNumber('contactNumber'),
    commonValidations.url('website'),
    commonValidations.enum('leadType', ['inbound', 'outbound', 'referral']),
    commonValidations.enum('leadSource', ['website', 'social_media', 'email', 'phone', 'referral', 'event', 'advertisement', 'other']),
    commonValidations.enum('status', ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost']),
    commonValidations.enum('budgetRange', ['under_10k', '10k_25k', '25k_50k', '50k_100k', '100k_250k', '250k_500k', 'over_500k']),
    commonValidations.number('conversionProbability', 0, 100),
    handleValidationErrors
  ],
  
  update: [
    commonValidations.objectId('id'),
    commonValidations.optionalString('businessName', 2),
    commonValidations.optionalString('contactPerson', 2),
    commonValidations.email(),
    commonValidations.phoneNumber('contactNumber'),
    commonValidations.url('website'),
    handleValidationErrors
  ]
};

// Invoice validation rules
export const invoiceValidations = {
  create: [
    commonValidations.requiredString('clientName', 2),
    commonValidations.email('clientEmail'),
    commonValidations.array('lineItems', 1),
    commonValidations.enum('currency', ['USD', 'EUR', 'GBP', 'INR']),
    commonValidations.date('dueDate'),
    body('lineItems.*.description')
      .notEmpty()
      .withMessage('Line item description is required'),
    body('lineItems.*.quantity')
      .isFloat({ min: 0.01 })
      .withMessage('Line item quantity must be greater than 0'),
    body('lineItems.*.unitPrice')
      .isFloat({ min: 0 })
      .withMessage('Line item unit price must be non-negative'),
    handleValidationErrors
  ]
};

// Payment validation rules
export const paymentValidations = {
  create: [
    commonValidations.array('invoiceIds', 1),
    commonValidations.number('amount', 0.01),
    commonValidations.enum('currency', ['USD', 'EUR', 'GBP', 'INR']),
    commonValidations.date('paymentDate'),
    commonValidations.enum('paymentMethod', ['bank_transfer', 'credit_card', 'paypal', 'stripe', 'cash', 'check', 'other']),
    commonValidations.optionalString('transactionReference', 1),
    body('invoiceIds.*')
      .isMongoId()
      .withMessage('Each invoice ID must be a valid MongoDB ObjectId'),
    handleValidationErrors
  ]
};

// Rate card validation rules
export const rateCardValidations = {
  create: [
    commonValidations.requiredString('rateCardName', 3),
    commonValidations.enum('category', ['content_creation', 'social_media_management', 'influencer_marketing', 'brand_partnerships', 'event_promotion', 'product_reviews', 'sponsored_content', 'consulting', 'other']),
    commonValidations.enum('serviceType', ['post', 'story', 'reel', 'video', 'blog', 'campaign', 'consultation', 'package', 'other']),
    commonValidations.number('baseRate', 0),
    commonValidations.number('discountPercentage', 0, 100),
    commonValidations.enum('pricingType', ['fixed', 'per_post', 'per_hour', 'per_day', 'per_week', 'per_month', 'per_campaign', 'negotiable']),
    commonValidations.enum('applicableFor', ['all', 'new_clients', 'existing_clients', 'premium_clients']),
    commonValidations.number('deliveryTime', 1),
    handleValidationErrors
  ]
};

// File upload validation
export const fileValidations = {
  image: [
    body('file').custom((value, { req }) => {
      if (!req.file) {
        throw new Error('Image file is required');
      }
      
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedMimes.includes(req.file.mimetype)) {
        throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        throw new Error('Image size must not exceed 5MB');
      }
      
      return true;
    }),
    handleValidationErrors
  ],
  
  document: [
    body('file').custom((value, { req }) => {
      if (!req.file) {
        throw new Error('Document file is required');
      }
      
      const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedMimes.includes(req.file.mimetype)) {
        throw new Error('Only PDF, DOC, DOCX, XLS, and XLSX files are allowed');
      }
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (req.file.size > maxSize) {
        throw new Error('Document size must not exceed 10MB');
      }
      
      return true;
    }),
    handleValidationErrors
  ]
};

// Create validation middleware factory
export const validate = (validations: ValidationChain[]) => {
  return [...validations, handleValidationErrors];
};
