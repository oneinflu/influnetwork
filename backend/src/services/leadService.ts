import { Lead } from '../models/Lead';

export const listLeads = async (filter: Record<string, unknown>, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const items = await Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Lead.countDocuments(filter);
  return { data: items, total, page, limit };
};

export const getLeadById = async (id: string) => {
  return Lead.findById(id);
};

export const createLead = async (payload: Record<string, unknown>) => {
  const lead = await Lead.create(payload);
  return lead;
};

export const updateLead = async (id: string, updates: Record<string, unknown>) => {
  const lead = await Lead.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  return lead;
};

export const deleteLead = async (id: string) => {
  return Lead.findByIdAndDelete(id);
};

export const changeLeadStatus = async (id: string, status: string) => {
  const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  return lead;
};