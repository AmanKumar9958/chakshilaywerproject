const successResponse = (res, message, data = null, status = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return res.status(status).json(response);
};

const errorResponse = (res, message, status = 500, details = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (details) {
    response.details = details;
  }
  
  if (process.env.NODE_ENV === 'development' && status >= 500) {
    response.debug = 'Check server logs for more details';
  }
  
  return res.status(status).json(response);
};

module.exports = {
  successResponse,
  errorResponse
};