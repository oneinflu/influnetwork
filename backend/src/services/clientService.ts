import { Client, IClient } from '../models/Client';

export const listClients = async (filter: Record<string, unknown>, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const items = await Client.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Client.countDocuments(filter);
  return { data: items, total, page, limit };
};

export const getClientById = async (id: string) => {
  return Client.findById(id);
};

export const createClient = async (payload: Partial<IClient>) => {
  const client = await Client.create(payload);
  return client;
};

export const updateClient = async (id: string, updates: Partial<IClient>) => {
  const client = await Client.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  return client;
};

export const deleteClient = async (id: string) => {
  return Client.findByIdAndDelete(id);
};