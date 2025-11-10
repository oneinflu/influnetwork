import { Request, Response } from 'express';
import { catchAsync, sendSuccessResponse, sendPaginatedResponse } from '../middleware/errorHandler';
import { listInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice, sendInvoice, recordInvoicePayment } from '../services/invoiceService';

export const getAllInvoices = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.clientId) filter.clientId = req.query.clientId;
  if (req.query.campaignId) filter.campaignId = req.query.campaignId;
  if (req.query.currency) filter.currency = req.query.currency;
  if (req.query.issueDateFrom || req.query.issueDateTo) {
    filter.issueDate = {
      ...(req.query.issueDateFrom ? { $gte: new Date(String(req.query.issueDateFrom)) } : {}),
      ...(req.query.issueDateTo ? { $lte: new Date(String(req.query.issueDateTo)) } : {})
    };
  }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search as string, 'i');
    filter.$or = [
      { invoiceNumber: searchRegex },
      { clientName: searchRegex },
      { campaignName: searchRegex }
    ];
  }

  const result = await listInvoices(filter, page, limit);
  sendPaginatedResponse(res, result.data, result.total, result.page, result.limit, 'Invoices retrieved successfully');
});

export const getInvoice = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const inv = await getInvoiceById(req.params.id);
  if (!inv) {
    res.status(404).json({ success: false, message: 'Invoice not found' });
    return;
  }
  sendSuccessResponse(res, { invoice: inv }, 'Invoice retrieved successfully');
});

export const addInvoice = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const payload = { ...req.body, createdBy: req.user?.id };
  const inv = await createInvoice(payload);
  sendSuccessResponse(res, { invoice: inv }, 'Invoice created successfully', 201);
});

export const editInvoice = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const inv = await updateInvoice(req.params.id, req.body);
  if (!inv) {
    res.status(404).json({ success: false, message: 'Invoice not found' });
    return;
  }
  sendSuccessResponse(res, { invoice: inv }, 'Invoice updated successfully');
});

export const removeInvoice = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const inv = await deleteInvoice(req.params.id);
  if (!inv) {
    res.status(404).json({ success: false, message: 'Invoice not found' });
    return;
  }
  sendSuccessResponse(res, null, 'Invoice deleted successfully');
});

export const sendInvoiceAction = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const inv = await sendInvoice(req.params.id, req.user?.id || 'system');
  if (!inv) {
    res.status(404).json({ success: false, message: 'Invoice not found' });
    return;
  }
  sendSuccessResponse(res, { invoice: inv }, 'Invoice marked as sent');
});

export const recordPaymentAction = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const inv = await recordInvoicePayment(req.params.id, {
    amount: req.body.amount,
    paymentDate: req.body.paymentDate ? new Date(req.body.paymentDate) : new Date(),
    paymentMethod: req.body.paymentMethod,
    transactionReference: req.body.transactionReference,
    notes: req.body.notes,
    receiptAttachment: req.body.receiptAttachment,
    recordedBy: req.user?.id || 'system',
    status: req.body.status
  });
  if (!inv) {
    res.status(404).json({ success: false, message: 'Invoice not found' });
    return;
  }
  sendSuccessResponse(res, { invoice: inv }, 'Payment recorded successfully');
});