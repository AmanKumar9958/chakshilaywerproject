const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let error = {
    success: false,
    message: 'Internal Server Error',
    status: 500
  };

  // Razorpay specific errors
  if (err.statusCode) {
    error.status = err.statusCode;
    error.message = err.error?.description || err.message || 'Payment processing error';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.status = 400;
    error.message = 'Validation Error';
    error.details = Object.values(err.errors).map(val => val.message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.status = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.status = 401;
    error.message = 'Token expired';
  }

  // Rate limit errors
  if (err.statusCode === 429) {
    error.status = 429;
    error.message = 'Too many requests, please try again later';
  }

  // Development vs production error response
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  res.status(error.status).json(error);
};

const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or missing API key'
    });
  }
  
  next();
};

const rateLimitMessage = {
  message: 'Too many requests from this IP, please try again later.',
  retryAfter: '15 minutes'
};

module.exports = {
  errorHandler,
  validateApiKey,
  rateLimitMessage
};