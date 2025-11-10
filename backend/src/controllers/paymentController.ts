import { Request, Response } from 'express';
import { catchAsync, sendSuccessResponse, sendPaginatedResponse } from '../middleware/errorHandler';
import { listPayments, getPaymentById, createPayment, updatePayment, deletePayment } from '../services/paymentService';

export const getAllPayments = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
  if (req.query.invoiceId) filter.invoiceIds = req.query.invoiceId;
  if (req.query.recordedBy) filter.recordedBy = req.query.recordedBy;

  if (req.query.paymentDateFrom || req.query.paymentDateTo) {
    filter.paymentDate = {
      ...(req.query.paymentDateFrom ? { $gte: new Date(String(req.query.paymentDateFrom)) } : {}),
      ...(req.query.paymentDateTo ? { $lte: new Date(String(req.query.paymentDateTo)) } : {})
    };
  }

  const result = await listPayments(filter, page, limit);
  sendPaginatedResponse(res, result.data, result.total, result.page, result.limit, 'Payments retrieved successfully');
});

export const getPayment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const p = await getPaymentById(req.params.id);
  if (!p) {
    res.status(404).json({ success: false, message: 'Payment not found' });
    return;
  }
  sendSuccessResponse(res, { payment: p }, 'Payment retrieved successfully');
});

export const addPayment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const payload = { ...req.body, recordedBy: req.user?.id };
  const p = await createPayment(payload);
  sendSuccessResponse(res, { payment: p }, 'Payment created successfully', 201);
});

export const editPayment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const p = await updatePayment(req.params.id, req.body);
  if (!p) {
    res.status(404).json({ success: false, message: 'Payment not found' });
    return;
  }
  sendSuccessResponse(res, { payment: p }, 'Payment updated successfully');
});

export const removePayment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const p = await deletePayment(req.params.id);
  if (!p) {
    res.status(404).json({ success: false, message: 'Payment not found' });
    return;
  }
  sendSuccessResponse(res, null, 'Payment deleted successfully');
});