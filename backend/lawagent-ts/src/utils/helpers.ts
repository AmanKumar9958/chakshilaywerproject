import { Response } from 'express';

/**
 * Standard API response helper
 */
export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
  meta?: any
) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data: data || null,
    meta: meta || null,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Success response helper
 */
export const sendSuccess = (
  res: Response,
  message: string = 'Success',
  data?: any,
  meta?: any
) => {
  return sendResponse(res, 200, message, data, meta);
};

/**
 * Created response helper
 */
export const sendCreated = (
  res: Response,
  message: string = 'Created successfully',
  data?: any
) => {
  return sendResponse(res, 201, message, data);
};

/**
 * Bad request response helper
 */
export const sendBadRequest = (
  res: Response,
  message: string = 'Bad request',
  errors?: any
) => {
  return sendResponse(res, 400, message, null, { errors });
};

/**
 * Unauthorized response helper
 */
export const sendUnauthorized = (
  res: Response,
  message: string = 'Unauthorized'
) => {
  return sendResponse(res, 401, message);
};

/**
 * Forbidden response helper
 */
export const sendForbidden = (
  res: Response,
  message: string = 'Forbidden'
) => {
  return sendResponse(res, 403, message);
};

/**
 * Not found response helper
 */
export const sendNotFound = (
  res: Response,
  message: string = 'Resource not found'
) => {
  return sendResponse(res, 404, message);
};

/**
 * Internal server error response helper
 */
export const sendServerError = (
  res: Response,
  message: string = 'Internal server error'
) => {
  return sendResponse(res, 500, message);
};

/**
 * Pagination helper
 */
export const getPagination = (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;
  return {
    skip: offset,
    take: limit,
    page,
    limit,
  };
};

/**
 * Pagination metadata helper
 */
export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNext,
    hasPrev,
  };
};