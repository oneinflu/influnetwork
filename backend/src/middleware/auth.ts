import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Custom error class
class AppError extends Error {
  public status: number;
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.status = statusCode;
    this.statusCode = statusCode;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Extend Express Request interface to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}

// JWT payload interface
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Allow OPTIONS requests to pass through for preflight checks
    if (req.method === 'OPTIONS') {
      return next();
    }

    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token is required', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new AppError('Access token is required', 401);
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError('JWT secret is not configured', 500);
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Find user by ID
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      throw new AppError('User not found or token is invalid', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token has expired', 401));
    } else {
      next(error);
    }
  }
};

// Authorization middleware factory
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (!roles.includes(req.user.role)) {
        // Temporary debug log to trace unauthorized route access
        console.warn(
          `[authorize] Insufficient permissions: user role="${req.user.role}", required roles=${JSON.stringify(roles)}, method=${req.method}, url=${req.originalUrl}`
        );
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Optional authentication middleware (doesn't throw error if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next();
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next();
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    }

    next();
  } catch {
    // Silently continue without user if token is invalid
    next();
  }
};

// Check if user owns resource or has admin privileges
export const checkOwnership = (resourceUserIdField: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      // Admin can access any resource
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user owns the resource
      const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
      
      if (!resourceUserId) {
        throw new AppError('Resource user ID not found', 400);
      }

      if (req.user._id.toString() !== resourceUserId) {
        throw new AppError('Access denied: You can only access your own resources', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware to check if user is verified
export const requireVerification = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!req.user.isEmailVerified) {
      throw new AppError('Email verification required', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Rate limiting by user
const userRequestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimitByUser = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        return next();
      }

      const userId = req.user._id.toString();
      const now = Date.now();
      const userLimit = userRequestCounts.get(userId);

      if (!userLimit || now > userLimit.resetTime) {
        // Reset or initialize counter
        userRequestCounts.set(userId, {
          count: 1,
          resetTime: now + windowMs
        });
        return next();
      }

      if (userLimit.count >= maxRequests) {
        throw new AppError('Too many requests, please try again later', 429);
      }

      // Increment counter
      userLimit.count++;
      userRequestCounts.set(userId, userLimit);

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [userId, limit] of userRequestCounts.entries()) {
    if (now > limit.resetTime) {
      userRequestCounts.delete(userId);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

export { AppError };