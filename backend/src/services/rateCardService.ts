import RateCard from '../models/RateCard';

export const listRateCards = async (filter: Record<string, unknown>, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const items = await RateCard.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await RateCard.countDocuments(filter);
  return { data: items, total, page, limit };
};

export const getRateCardById = async (id: string) => {
  return RateCard.findById(id);
};

export const createRateCard = async (payload: Record<string, unknown>) => {
  const rc = await RateCard.create(payload);
  return rc;
};

export const updateRateCard = async (id: string, updates: Record<string, unknown>) => {
  const rc = await RateCard.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  return rc;
};

export const deleteRateCard = async (id: string) => {
  return RateCard.findByIdAndDelete(id);
};

export const toggleRateCardVisibility = async (id: string) => {
  const rc = await RateCard.findById(id);
  if (!rc) return null;
  rc.visibility = rc.visibility === 'Public' ? 'Private' : 'Public';
  await rc.save();
  return rc;
};