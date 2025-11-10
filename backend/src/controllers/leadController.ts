import { Request, Response } from 'express';
import { catchAsync, sendSuccessResponse, sendPaginatedResponse } from '../middleware/errorHandler';
import { listLeads, getLeadById, createLead, updateLead, deleteLead, changeLeadStatus } from '../services/leadService';

export const getAllLeads = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.leadType) filter.leadType = req.query.leadType;
  if (req.query.leadSource) filter.leadSource = req.query.leadSource;
  if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

  if (req.query.nextFollowUpFrom || req.query.nextFollowUpTo) {
    filter.nextFollowUp = {
      ...(req.query.nextFollowUpFrom ? { $gte: new Date(String(req.query.nextFollowUpFrom)) } : {}),
      ...(req.query.nextFollowUpTo ? { $lte: new Date(String(req.query.nextFollowUpTo)) } : {})
    };
  }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search as string, 'i');
    filter.$or = [
      { businessName: searchRegex },
      { contactPerson: searchRegex },
      { email: searchRegex },
      { website: searchRegex },
      { notes: searchRegex }
    ];
  }

  const result = await listLeads(filter, page, limit);
  sendPaginatedResponse(res, result.data, result.total, result.page, result.limit, 'Leads retrieved successfully');
});

export const getLead = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const lead = await getLeadById(req.params.id);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  sendSuccessResponse(res, { lead }, 'Lead retrieved successfully');
});

export const addLead = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const payload = { ...req.body, createdBy: req.user?.id };
  const lead = await createLead(payload);
  sendSuccessResponse(res, { lead }, 'Lead created successfully', 201);
});

export const editLead = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const lead = await updateLead(req.params.id, req.body);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  sendSuccessResponse(res, { lead }, 'Lead updated successfully');
});

export const removeLead = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const lead = await deleteLead(req.params.id);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  sendSuccessResponse(res, null, 'Lead deleted successfully');
});

export const updateLeadStatus = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const lead = await changeLeadStatus(req.params.id, req.body.status);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  sendSuccessResponse(res, { lead }, 'Lead status updated successfully');
});