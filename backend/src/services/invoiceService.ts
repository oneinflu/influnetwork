/* eslint-disable @typescript-eslint/no-explicit-any */
import Invoice from '../models/Invoice';

export const listInvoices = async (filter: Record<string, unknown>, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const items = await Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Invoice.countDocuments(filter);
  return { data: items, total, page, limit };
};

export const getInvoiceById = async (id: string) => {
  return Invoice.findById(id);
};

export const createInvoice = async (payload: Record<string, unknown>) => {
  const inv = await Invoice.create(payload);
  return inv;
};

export const updateInvoice = async (id: string, updates: Record<string, unknown>) => {
  const inv = await Invoice.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  return inv;
};

export const deleteInvoice = async (id: string) => {
  return Invoice.findByIdAndDelete(id);
};

export const sendInvoice = async (id: string, performedBy: string) => {
  const inv = await Invoice.findById(id);
  if (!inv) return null;
  inv.status = 'Sent';
  inv.sentDate = new Date();
  inv.activities = inv.activities || [];
  inv.activities.push({
    id: String(Date.now()),
    invoiceId: inv.id,
    activityType: 'sent',
    description: 'Invoice sent to client',
    performedBy,
    performedOn: new Date(),
    metadata: {}
  });
  await inv.save();
  return inv;
};

export const recordInvoicePayment = async (
  id: string,
  payment: {
    amount: number;
    paymentDate: Date;
    paymentMethod: string;
    transactionReference?: string;
    notes?: string;
    receiptAttachment?: string;
    recordedBy: string;
    status?: string;
  }
) => {
  const inv = await Invoice.findById(id);
  if (!inv) return null;

  inv.payments = inv.payments || [];
  inv.payments.push({
    id: String(Date.now()),
    invoiceId: inv.id,
    amount: payment.amount,
    paymentDate: payment.paymentDate || new Date(),
    paymentMethod: payment.paymentMethod as any,
    transactionReference: payment.transactionReference,
    status: (payment.status as any) || 'Completed',
    notes: payment.notes,
    receiptAttachment: payment.receiptAttachment,
    recordedBy: payment.recordedBy,
    recordedOn: new Date(),
    lastUpdated: new Date()
  });

  inv.amountPaid = (inv.amountPaid || 0) + payment.amount;
  inv.balanceDue = Math.max(0, inv.totalAmount - inv.amountPaid);
  inv.lastPaymentMethod = payment.paymentMethod as any;

  if (inv.balanceDue <= 0 && inv.amountPaid >= inv.totalAmount) {
    inv.status = 'Paid';
  } else {
    inv.status = 'Partially Paid';
  }

  inv.activities = inv.activities || [];
  inv.activities.push({
    id: String(Date.now()),
    invoiceId: inv.id,
    activityType: 'payment_recorded',
    description: `Payment recorded: ${payment.amount}`,
    performedBy: payment.recordedBy,
    performedOn: new Date(),
    metadata: { paymentMethod: payment.paymentMethod }
  });

  await inv.save();
  return inv;
};