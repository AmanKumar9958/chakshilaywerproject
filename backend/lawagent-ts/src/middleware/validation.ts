import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { sendBadRequest } from '@/utils/helpers';

/**
 * Middleware to validate request body, params, or query using Joi schema
 */
export const validate = (schema: {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: any = {};

    // Validate body
    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false });
      if (error) {
        errors.body = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));
      }
    }

    // Validate params
    if (schema.params) {
      const { error } = schema.params.validate(req.params, { abortEarly: false });
      if (error) {
        errors.params = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));
      }
    }

    // Validate query
    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false });
      if (error) {
        errors.query = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));
      }
    }

    // If there are validation errors, return 400
    if (Object.keys(errors).length > 0) {
      sendBadRequest(res, 'Validation failed', errors);
      return;
    }

    next();
  };
};

// Common validation schemas
export const commonSchemas = {
  id: Joi.string().required().messages({
    'string.empty': 'ID is required',
    'any.required': 'ID is required',
  }),
  
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),

  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),

  role: Joi.string().valid('ADMIN', 'ADVOCATE', 'STUDENT', 'CLIENT').messages({
    'any.only': 'Role must be one of: ADMIN, ADVOCATE, STUDENT, CLIENT',
  }),

  caseStatus: Joi.string().valid('DRAFT', 'ACTIVE', 'PENDING', 'CLOSED', 'ARCHIVED').messages({
    'any.only': 'Case status must be one of: DRAFT, ACTIVE, PENDING, CLOSED, ARCHIVED',
  }),

  paymentStatus: Joi.string().valid('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED').messages({
    'any.only': 'Payment status must be one of: PENDING, COMPLETED, FAILED, REFUNDED',
  }),
};