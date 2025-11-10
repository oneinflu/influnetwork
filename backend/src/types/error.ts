export interface AppError extends Error {
  status?: number;
  statusCode?: number;
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: string;
  stack?: string;
}