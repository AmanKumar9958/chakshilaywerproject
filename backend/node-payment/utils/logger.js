const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, 
      Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : '');
  },
  
  error: (message, meta = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, 
      Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : '');
  },
  
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, 
      Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : '');
  },
  
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, 
        Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : '');
    }
  }
};

module.exports = { logger };