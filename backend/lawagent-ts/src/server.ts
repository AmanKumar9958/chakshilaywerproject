import app from './app';
import { config } from '@/config';
import { logger } from '@/utils/logger';
import { prisma } from '@/services/prisma';

const PORT = config.server.port;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connection established');

    // Start server
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Chakshi Backend server running on http://0.0.0.0:${PORT}`);
      logger.info(`📚 API Documentation available at http://0.0.0.0:${PORT}/api/docs`);
      logger.info(`🔍 Health check available at http://0.0.0.0:${PORT}/health`);
      logger.info(`🌍 Environment: ${config.server.nodeEnv}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();