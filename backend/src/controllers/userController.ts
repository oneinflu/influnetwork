import { Request, Response } from 'express';
import User from '../models/User';
import { catchAsync, sendSuccessResponse, sendPaginatedResponse } from '../middleware/errorHandler';

// Get all users (admin only)
export const getAllUsers = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: Record<string, unknown> = {};
  
  if (req.query.role) {
    filter.role = req.query.role;
  }
  
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }
  
  if (req.query.isEmailVerified !== undefined) {
    filter.isEmailVerified = req.query.isEmailVerified === 'true';
  }

  // Search by name or email
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search as string, 'i');
    filter.$or = [
      { fullName: searchRegex },
      { email: searchRegex },
    ];
  }

  const users = await User.find(filter)
    .select('-password -passwordResetToken -emailVerificationToken')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  sendPaginatedResponse(res, users, total, page, limit, 'Users retrieved successfully');
});

// Get user by ID
export const getUserById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id)
    .select('-password -passwordResetToken -emailVerificationToken');

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  sendSuccessResponse(res, { user }, 'User retrieved successfully');
});

// Update user (admin only)
export const updateUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const allowedFields = [
    'firstName',
    'lastName',
    'fullName',
    'email',
    'role',
    'isActive',
    'isEmailVerified',
    'phoneNumber',
    'bio',
    'website',
    'companyName',
    'location',
    'socialMedia',
  ];

  const filteredBody: Record<string, unknown> = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  // Update full name if first or last name changed
  if (filteredBody.firstName || filteredBody.lastName) {
    const user = await User.findById(req.params.id);
    const firstName = (filteredBody.firstName as string) || user?.firstName;
    const lastName = (filteredBody.lastName as string) || user?.lastName;
    filteredBody.fullName = `${firstName} ${lastName}`;
  }

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  }).select('-password -passwordResetToken -emailVerificationToken');

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  sendSuccessResponse(res, { user }, 'User updated successfully');
});

// Delete user (admin only)
export const deleteUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  sendSuccessResponse(res, null, 'User deleted successfully');
});

// Get user statistics (admin only)
export const getUserStats = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: {
            $cond: [{ $eq: ['$isActive', true] }, 1, 0],
          },
        },
        verifiedUsers: {
          $sum: {
            $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0],
          },
        },
        usersByRole: {
          $push: '$role',
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalUsers: 1,
        activeUsers: 1,
        verifiedUsers: 1,
        inactiveUsers: { $subtract: ['$totalUsers', '$activeUsers'] },
        unverifiedUsers: { $subtract: ['$totalUsers', '$verifiedUsers'] },
        usersByRole: 1,
      },
    },
  ]);

  // Count users by role
  const roleStats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    ...stats[0],
    roleBreakdown: roleStats.reduce((acc, role) => {
      acc[role._id] = role.count;
      return acc;
    }, {} as Record<string, number>),
  };

  sendSuccessResponse(res, result, 'User statistics retrieved successfully');
});

// Deactivate user account (admin only)
export const deactivateUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  ).select('-password -passwordResetToken -emailVerificationToken');

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  sendSuccessResponse(res, { user }, 'User deactivated successfully');
});

// Activate user account (admin only)
export const activateUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  ).select('-password -passwordResetToken -emailVerificationToken');

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  sendSuccessResponse(res, { user }, 'User activated successfully');
});