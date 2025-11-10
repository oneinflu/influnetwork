import { Request, Response } from 'express';

import { Payment } from '../models/Payment';
import { Project } from '../models/Project';
import Invoice from '../models/Invoice';
import Person from '../models/Person';
import RateCard from '../models/RateCard';
import { catchAsync, sendSuccessResponse } from '../middleware/errorHandler';

const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

export const getDashboardStats = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { start, end } = getMonthRange();

  const [activeCampaigns, activeClients, invoicesSent, servicesListed, monthlyRevenueAgg, paymentsReceivedAgg, paymentsPendingAgg] = await Promise.all([
    // Count active projects as active campaigns
    Project.countDocuments({ status: 'active' }),
    // Treat any active person as an active client; refine by role if needed
    Person.countDocuments({ status: 'Active' }),
    // Consider all non-draft and non-cancelled invoices as sent/issued
    Invoice.countDocuments({ status: { $in: ['Sent', 'Partially Paid', 'Paid', 'Overdue'] } }),
    RateCard.countDocuments({ visibility: 'Public' }),
    Payment.aggregate([
      { $match: { status: 'Completed', paymentDate: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Payment.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Payment.aggregate([
      { $match: { status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
  ]);

  const monthlyRevenue = monthlyRevenueAgg?.[0]?.total || 0;
  const paymentsReceived = paymentsReceivedAgg?.[0]?.total || 0;
  const paymentsPending = paymentsPendingAgg?.[0]?.total || 0;

  const data = {
    activeCampaigns,
    monthlyRevenue,
    activeClients,
    invoicesSent,
    paymentsReceived,
    paymentsPending,
    servicesListed,
  };

  sendSuccessResponse(res, data, 'Dashboard stats retrieved successfully');
});