import { Payment } from '../models/Payment';

export const listPayments = async (filter: Record<string, unknown>, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const items = await Payment.find(filter).sort({ paymentDate: -1 }).skip(skip).limit(limit);
  const total = await Payment.countDocuments(filter);
  return { data: items, total, page, limit };
};

export const getPaymentById = async (id: string) => {
  return Payment.findById(id);
};

export const createPayment = async (payload: Record<string, unknown>) => {
  const p = await Payment.create(payload);
  return p;
};

export const updatePayment = async (id: string, updates: Record<string, unknown>) => {
  const p = await Payment.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  return p;
};

export const deletePayment = async (id: string) => {
  return Payment.findByIdAndDelete(id);
};