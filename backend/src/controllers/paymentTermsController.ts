import { Request, Response } from 'express';
import { catchAsync, sendSuccessResponse, sendPaginatedResponse } from '../middleware/errorHandler';
import { 
  listPaymentTermsTemplates, 
  getPaymentTermsTemplateById, 
  createPaymentTermsTemplate, 
  updatePaymentTermsTemplate, 
  deletePaymentTermsTemplate,
  getActivePaymentTermsTemplates
} from '../services/paymentTermsService';

export const getAllPaymentTermsTemplates = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const filter: Record<string, unknown> = {};
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  if (req.query.search) {
    const searchRegex = new RegExp(String(req.query.search), 'i');
    filter.$or = [
      { name: searchRegex },
      { description: searchRegex }
    ];
  }

  const result = await listPaymentTermsTemplates(filter, page, limit);
  sendPaginatedResponse(res, result.data, result.total, result.page, result.limit, 'Payment terms templates retrieved successfully');
});

export const getPaymentTermsTemplate = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const template = await getPaymentTermsTemplateById(req.params.id);
  if (!template) {
    res.status(404).json({ success: false, message: 'Payment terms template not found' });
    return;
  }
  sendSuccessResponse(res, { template }, 'Payment terms template retrieved successfully');
});

export const addPaymentTermsTemplate = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const payload = { ...req.body, createdBy: req.user?._id.toString() };
  const template = await createPaymentTermsTemplate(payload);
  sendSuccessResponse(res, { template }, 'Payment terms template created successfully', 201);
});

export const editPaymentTermsTemplate = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const template = await updatePaymentTermsTemplate(req.params.id, req.body);
  if (!template) {
    res.status(404).json({ success: false, message: 'Payment terms template not found' });
    return;
  }
  sendSuccessResponse(res, { template }, 'Payment terms template updated successfully');
});

export const removePaymentTermsTemplate = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const template = await deletePaymentTermsTemplate(req.params.id);
  if (!template) {
    res.status(404).json({ success: false, message: 'Payment terms template not found' });
    return;
  }
  sendSuccessResponse(res, null, 'Payment terms template deleted successfully');
});

export const getActiveTemplates = catchAsync(async (req: Request, res: Response): Promise<void> => {
  let templates = await getActivePaymentTermsTemplates();
  
  // If no templates exist, create a default one
  if (!templates || templates.length === 0) {
    console.log('No payment terms templates found, creating default template...');
    const defaultTemplate = {
      name: 'Standard Payment Terms',
      description: 'Default payment terms with 50% advance and 50% on completion',
      milestones: [
        {
          id: 'milestone-1',
          description: 'Advance Payment',
          percentage: 50,
          daysFromStart: 0,
          isPercentage: true,
          conditions: 'Upon project confirmation'
        },
        {
          id: 'milestone-2', 
          description: 'Final Payment',
          percentage: 50,
          daysFromStart: 30,
          isPercentage: true,
          conditions: 'Upon project completion'
        }
      ],
      isDefault: true,
      isActive: true,
      createdBy: req.user?._id.toString() || 'system'
    };
    
    try {
      const created = await createPaymentTermsTemplate(defaultTemplate);
      templates = [created];
      console.log('Default payment terms template created successfully');
    } catch (error) {
      console.error('Failed to create default payment terms template:', error);
    }
  }
  
  sendSuccessResponse(res, { templates }, 'Active payment terms templates retrieved successfully');
});