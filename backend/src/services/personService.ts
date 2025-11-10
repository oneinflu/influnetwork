import Person from '../models/Person';

export const listPeople = async (filter: Record<string, unknown>, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const people = await Person.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Person.countDocuments(filter);
  return { data: people, total, page, limit };
};

export const getPersonById = async (id: string) => {
  return Person.findById(id);
};

export const createPerson = async (payload: Record<string, unknown>) => {
  const person = await Person.create(payload);
  return person;
};

export const updatePerson = async (id: string, updates: Record<string, unknown>) => {
  const person = await Person.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  return person;
};

export const deletePerson = async (id: string) => {
  return Person.findByIdAndDelete(id);
};