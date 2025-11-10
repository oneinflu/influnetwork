import { Request, Response } from 'express';
import { catchAsync, sendSuccessResponse, sendPaginatedResponse } from '../middleware/errorHandler';
import { listClients, getClientById, createClient, updateClient, deleteClient } from '../services/clientService';

export const getAllClients = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const filter: Record<string, unknown> = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.isGstRegistered) filter.isGstRegistered = req.query.isGstRegistered === 'true';

  if (req.query.search) {
    const searchRegex = new RegExp(String(req.query.search), 'i');
    filter.$or = [
      { businessName: searchRegex },
      { category: searchRegex },
      { website: searchRegex },
      { notes: searchRegex },
      { 'businessAddress.city': searchRegex },
      { 'businessAddress.state': searchRegex }
    ];
  }

  const result = await listClients(filter, page, limit);
  sendPaginatedResponse(res, result.data, result.total, result.page, result.limit, 'Clients retrieved successfully');
});

export const getClient = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const client = await getClientById(req.params.id);
  if (!client) {
    res.status(404).json({ success: false, message: 'Client not found' });
    return;
  }
  sendSuccessResponse(res, { client }, 'Client retrieved successfully');
});

export const addClient = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const payload = { ...req.body, createdBy: req.user?.id };
  const client = await createClient(payload);
  sendSuccessResponse(res, { client }, 'Client created successfully', 201);
});

export const editClient = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const client = await updateClient(req.params.id, req.body);
  if (!client) {
    res.status(404).json({ success: false, message: 'Client not found' });
    return;
  }
  sendSuccessResponse(res, { client }, 'Client updated successfully');
});

export const removeClient = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const client = await deleteClient(req.params.id);
  if (!client) {
    res.status(404).json({ success: false, message: 'Client not found' });
    return;
  }
  sendSuccessResponse(res, null, 'Client deleted successfully');
});