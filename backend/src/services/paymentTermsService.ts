import { PaymentTermsTemplate, IPaymentTermsTemplate } from '../models/PaymentTerms';

export const listPaymentTermsTemplates = async (filter: Record<string, unknown> = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const items = await PaymentTermsTemplate.find(filter).sort({ isDefault: -1, name: 1 }).skip(skip).limit(limit);
  const total = await PaymentTermsTemplate.countDocuments(filter);
  return { data: items, total, page, limit };
};

export const getPaymentTermsTemplateById = async (id: string) => {
  return PaymentTermsTemplate.findById(id);
};

export const createPaymentTermsTemplate = async (payload: Partial<IPaymentTermsTemplate>) => {
  const template = await PaymentTermsTemplate.create(payload);
  return template;
};

export const updatePaymentTermsTemplate = async (id: string, updates: Partial<IPaymentTermsTemplate>) => {
  const template = await PaymentTermsTemplate.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  return template;
};

export const deletePaymentTermsTemplate = async (id: string) => {
  return PaymentTermsTemplate.findByIdAndDelete(id);
};

export const getDefaultPaymentTermsTemplate = async () => {
  return PaymentTermsTemplate.findOne({ isDefault: true, isActive: true });
};

export const getActivePaymentTermsTemplates = async () => {
  return PaymentTermsTemplate.find({ isActive: true }).sort({ isDefault: -1, name: 1 });
};