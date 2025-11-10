import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import { catchAsync, sendSuccessResponse } from '../middleware/errorHandler';

// JWT signing function
const signToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  const payload = { 
    userId: user._id.toString(),
    email: user.email,
    role: user.role 
  };
  
  // Use number for expiresIn (7 days in seconds)
  const options = { 
    expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
  };
  
  return jwt.sign(payload, secret, options);
};

const createSendToken = (user: IUser, statusCode: number, res: Response): void => {
  const token = signToken(user);
  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRES_IN as string) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  const userObj = user.toObject();
  delete userObj.password;

  sendSuccessResponse(res, {
    token,
    user: userObj,
  }, 'Authentication successful', statusCode);
};

// Register new user
export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName, role, phoneNumber } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({
      success: false,
      message: 'User already exists with this email',
    });
    return;
  }

  // Create full name
  const fullName = `${firstName} ${lastName}`;

  // Create new user
  const newUser = await User.create({
    email,
    password,
    firstName,
    lastName,
    fullName,
    role: role || 'user',
    phoneNumber,
  });

  createSendToken(newUser, 201, res);
});

// Login user
export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
    return;
  }

  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({
      success: false,
      message: 'Incorrect email or password',
    });
    return;
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});

// Logout user
export const logout = catchAsync(async (req: Request, res: Response): Promise<void> => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  sendSuccessResponse(res, null, 'Logged out successfully');
});

// Get current user
export const getMe = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id);
  sendSuccessResponse(res, { user }, 'User retrieved successfully');
});

// Update user profile
export const updateProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
  // Create object with allowed fields
  const allowedFields = [
    'firstName',
    'lastName',
    'fullName',
    'phoneNumber',
    'bio',
    'website',
    'companyName',
    'location',
    'socialMedia',
    'profilePhoto',
  ];

  const filteredBody: Record<string, unknown> = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  // Update full name if first or last name changed
  if (filteredBody.firstName || filteredBody.lastName) {
    const user = await User.findById(req.user?.id);
    const firstName = (filteredBody.firstName as string) || user?.firstName;
    const lastName = (filteredBody.lastName as string) || user?.lastName;
    filteredBody.fullName = `${firstName} ${lastName}`;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user?.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  sendSuccessResponse(res, { user: updatedUser }, 'Profile updated successfully');
});

// Change password
export const changePassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;

  // Get user from collection
  const user = await User.findById(req.user?.id).select('+password');

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  // Check if current password is correct
  if (!(await user.comparePassword(currentPassword))) {
    res.status(400).json({
      success: false,
      message: 'Current password is incorrect',
    });
    return;
  }

  // Update password
  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  createSendToken(user, 200, res);
});

// Forgot password
export const forgotPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
  // Get user based on email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'No user found with that email address',
    });
    return;
  }

  // Generate random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await user.save({ validateBeforeSave: false });

  // TODO: Send email with reset token
  sendSuccessResponse(res, { resetToken }, 'Password reset token sent to email');
});

// Reset password
export const resetPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
  // Get user based on token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If token has not expired and there is a user, set new password
  if (!user) {
    res.status(400).json({
      success: false,
      message: 'Token is invalid or has expired',
    });
    return;
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = new Date();

  await user.save();

  createSendToken(user, 200, res);
});

// Verify email
export const verifyEmail = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({
      success: false,
      message: 'Token is invalid or has expired',
    });
    return;
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save({ validateBeforeSave: false });

  sendSuccessResponse(res, null, 'Email verified successfully');
});

// Resend email verification
export const resendEmailVerification = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  if (user.isEmailVerified) {
    res.status(400).json({
      success: false,
      message: 'Email is already verified',
    });
    return;
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await user.save({ validateBeforeSave: false });

  // TODO: Send verification email
  sendSuccessResponse(res, { verificationToken }, 'Verification email sent');
});