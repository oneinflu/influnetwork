import express from 'express';
import {
  getAllProjects,
  getProject,
  addProject,
  editProject,
  removeProject,
  updateProjectMilestone,
  getClientProjects,
  getProjectStatistics
} from '../controllers/projectController';
import { authenticate } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';
import { body, param, query } from 'express-validator';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Validation rules
const createProjectValidation = [
  body('campaignName')
    .trim()
    .notEmpty()
    .withMessage('Campaign name is required')
    .isLength({ max: 200 })
    .withMessage('Campaign name cannot exceed 200 characters'),
  body('clientId')
    .notEmpty()
    .withMessage('Client ID is required')
    .isMongoId()
    .withMessage('Invalid client ID'),
  body('projectAgreedBudget')
    .isNumeric()
    .withMessage('Budget must be a number')
    .isFloat({ min: 0 })
    .withMessage('Budget must be positive'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('campaignType')
    .isIn(['Influencer Campaign', 'UGC', 'Event', 'Branding', 'Other'])
    .withMessage('Invalid campaign type'),
  body('targetPlatform')
    .isArray({ min: 1 })
    .withMessage('At least one target platform is required'),
  body('paymentTerms')
    .isIn(['default', 'customised'])
    .withMessage('Invalid payment terms type'),
  body('milestones')
    .isArray({ min: 1 })
    .withMessage('At least one milestone is required'),
  body('milestones.*.milestoneName')
    .trim()
    .notEmpty()
    .withMessage('Milestone name is required'),
  body('milestones.*.payment.type')
    .isIn(['amount', 'percentage'])
    .withMessage('Invalid payment type'),
  body('milestones.*.payment.value')
    .isNumeric()
    .withMessage('Payment value must be a number')
    .isFloat({ min: 0 })
    .withMessage('Payment value must be positive'),
  body('milestones.*.collectIn')
    .isInt({ min: 0 })
    .withMessage('Collection days must be a non-negative integer')
];

const updateProjectValidation = [
  body('campaignName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Campaign name cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Campaign name cannot exceed 200 characters'),
  body('clientId')
    .optional()
    .isMongoId()
    .withMessage('Invalid client ID'),
  body('projectAgreedBudget')
    .optional()
    .isNumeric()
    .withMessage('Budget must be a number')
    .isFloat({ min: 0 })
    .withMessage('Budget must be positive'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('campaignType')
    .optional()
    .isIn(['Influencer Campaign', 'UGC', 'Event', 'Branding', 'Other'])
    .withMessage('Invalid campaign type'),
  body('status')
    .optional()
    .isIn(['draft', 'active', 'completed', 'cancelled', 'on-hold'])
    .withMessage('Invalid status')
];

const milestoneUpdateValidation = [
  param('projectId')
    .isMongoId()
    .withMessage('Invalid project ID'),
  param('milestoneId')
    .notEmpty()
    .withMessage('Milestone ID is required'),
  body('status')
    .isIn(['pending', 'completed', 'overdue'])
    .withMessage('Invalid milestone status'),
  body('completedAt')
    .optional()
    .isISO8601()
    .withMessage('Completed date must be a valid date')
];

const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

const clientIdValidation = [
  param('clientId')
    .isMongoId()
    .withMessage('Invalid client ID format')
];

// Routes
router.get('/stats', getProjectStatistics);
router.get('/client/:clientId', clientIdValidation, handleValidationErrors, getClientProjects);
router.get('/', getAllProjects);
router.get('/:id', mongoIdValidation, handleValidationErrors, getProject);
router.post('/', createProjectValidation, handleValidationErrors, addProject);
router.put('/:id', mongoIdValidation, updateProjectValidation, handleValidationErrors, editProject);
router.delete('/:id', mongoIdValidation, handleValidationErrors, removeProject);
router.patch('/:projectId/milestones/:milestoneId', milestoneUpdateValidation, handleValidationErrors, updateProjectMilestone);

export default router;