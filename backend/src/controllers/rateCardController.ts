import { Request, Response } from 'express';
import { catchAsync, sendSuccessResponse, sendPaginatedResponse } from '../middleware/errorHandler';
import { listRateCards, getRateCardById, createRateCard, updateRateCard, deleteRateCard, toggleRateCardVisibility } from '../services/rateCardService';

export const getAllRateCards = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const filter: Record<string, unknown> = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.serviceType) filter.serviceType = req.query.serviceType;
  if (req.query.visibility) filter.visibility = req.query.visibility;
  if (req.query.linkedInfluencer) filter.linkedInfluencer = req.query.linkedInfluencer;

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search as string, 'i');
    filter.$or = [
      { rateCardName: searchRegex },
      { inclusions: searchRegex },
      { linkedInfluencer: searchRegex }
    ];
  }

  const result = await listRateCards(filter, page, limit);
  sendPaginatedResponse(res, result.data, result.total, result.page, result.limit, 'Rate cards retrieved successfully');
});

export const getRateCard = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const rc = await getRateCardById(req.params.id);
  if (!rc) {
    res.status(404).json({ success: false, message: 'Rate card not found' });
    return;
  }
  sendSuccessResponse(res, { rateCard: rc }, 'Rate card retrieved successfully');
});

export const addRateCard = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const payload = { ...req.body, createdBy: req.user?.id };
  const rc = await createRateCard(payload);
  sendSuccessResponse(res, { rateCard: rc }, 'Rate card created successfully', 201);
});

export const editRateCard = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const rc = await updateRateCard(req.params.id, req.body);
  if (!rc) {
    res.status(404).json({ success: false, message: 'Rate card not found' });
    return;
  }
  sendSuccessResponse(res, { rateCard: rc }, 'Rate card updated successfully');
});

export const removeRateCard = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const rc = await deleteRateCard(req.params.id);
  if (!rc) {
    res.status(404).json({ success: false, message: 'Rate card not found' });
    return;
  }
  sendSuccessResponse(res, null, 'Rate card deleted successfully');
});

export const toggleVisibility = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const rc = await toggleRateCardVisibility(req.params.id);
  if (!rc) {
    res.status(404).json({ success: false, message: 'Rate card not found' });
    return;
  }
  sendSuccessResponse(res, { rateCard: rc }, 'Rate card visibility updated');
});