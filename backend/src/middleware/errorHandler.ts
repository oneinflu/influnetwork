import { Request, Response, NextFunction } from 'express';
import { AppError } from './auth';

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    stack?: string;
  };
  timestamp: string;
  path: string;
  method: string;
}

// Success response interface
interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

// Paginated response interface
interface PaginatedResponse<T = unknown> {
  success: true;
  message: string;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  timestamp: string;
}

// Global error handling middleware
export const globalErrorHandler = (
  err: Error & { statusCode?: number; status?: string },
  req: Request,
  res: Response
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const catchAsync = <T extends Request, U extends Response, V extends NextFunction>(
  fn: (req: T, res: U, next: V) => Promise<void>
) => {
  return (req: T, res: U, next: V): void => {
    fn(req, res, next).catch(next);
  };
};

// Handle unhandled routes
export const handleNotFound = (req: Request, res: Response, next: NextFunction): void => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

// Success response helper
export const sendSuccessResponse = <T = unknown>(
  res: Response,
  data: T = null as T,
  message: string = 'Success',
  statusCode: number = 200
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  res.status(statusCode).json(response);
};

// Pagination response helper
export const sendPaginatedResponse = <T = unknown>(
  res: Response,
  data: T[],
  totalCount: number,
  page: number,
  limit: number,
  message: string = 'Success'
): void => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    },
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
};

// Handle specific MongoDB errors
export const handleMongoError = (err: Error & { code?: number; name?: string }): AppError => {
  if (err.name === 'CastError') {
    return new AppError('Invalid ID format', 400);
  }
  
  if (err.code === 11000) {
    return new AppError('Duplicate field value. Please use another value!', 400);
  }
  
  if (err.name === 'ValidationError') {
    return new AppError('Invalid input data', 400);
  }
  
  return new AppError(err.message, 500);
};

// Handle JWT errors
export const handleJWTError = (err: Error): AppError => {
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid token. Please log in again!', 401);
  }
  
  if (err.name === 'TokenExpiredError') {
    return new AppError('Your token has expired! Please log in again.', 401);
  }
  
  return new AppError(err.message, 401);
};