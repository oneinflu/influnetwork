import { Request, Response } from 'express';
import { catchAsync, sendSuccessResponse, sendPaginatedResponse } from '../middleware/errorHandler';
import { listPeople, getPersonById, createPerson, updatePerson, deletePerson } from '../services/personService';

export const getAllPeople = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.availabilityStatus) filter.availabilityStatus = req.query.availabilityStatus;
  if (req.query.tags) filter.tags = { $in: String(req.query.tags).split(',') };
  if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search as string, 'i');
    filter.$or = [
      { fullName: searchRegex },
      { email: searchRegex },
      { shortBio: searchRegex },
      { longBio: searchRegex }
    ];
  }

  const result = await listPeople(filter, page, limit);
  sendPaginatedResponse(res, result.data, result.total, result.page, result.limit, 'People retrieved successfully');
});

export const getPerson = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const person = await getPersonById(req.params.id);
  if (!person) {
    res.status(404).json({ success: false, message: 'Person not found' });
    return;
  }
  sendSuccessResponse(res, { person }, 'Person retrieved successfully');
});

export const addPerson = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const payload = { ...req.body, assignedTo: req.user?.id };
  const person = await createPerson(payload);
  sendSuccessResponse(res, { person }, 'Person created successfully', 201);
});

export const editPerson = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const person = await updatePerson(req.params.id, req.body);
  if (!person) {
    res.status(404).json({ success: false, message: 'Person not found' });
    return;
  }
  sendSuccessResponse(res, { person }, 'Person updated successfully');
});

export const removePerson = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const person = await deletePerson(req.params.id);
  if (!person) {
    res.status(404).json({ success: false, message: 'Person not found' });
    return;
  }
  sendSuccessResponse(res, null, 'Person deleted successfully');
});