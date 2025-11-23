import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { config, validateConfig } from '@/config';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

// Import routes
import authRoutes from '@/modules/auth/routes';
import dashboardRoutes from '@/modules/dashboard/routes';
import casesRoutes from '@/modules/cases/routes';
import documentsRoutes from '@/modules/documents/routes'; // Re-add documents routes
import notificationsRoutes from '@/modules/notifications/routes';
import scheduleRoutes from '@/modules/schedule/routes';
import activityRoutes from '@/modules/activity/routes';
import clientRoutes from '@/modules/clients/routes';
import hearingRoutes from '@/modules/hearings/routes';
import templatesRoutes from '@/modules/templates/routes';

// Validate configuration
validateConfig();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chakshi Backend API',
      version: '1.0.0',
      description: 'Node.js + TypeScript backend for Chakshi with Supabase and Razorpay integration',
      contact: {
        name: 'Chakshi Team',
        email: 'support@chakshi.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'ADVOCATE', 'STUDENT', 'CLIENT'] },
            avatar: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/modules/*/routes.ts', './src/modules/templates/routes.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(swaggerOptions);

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Chakshi API Documentation',
}));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Chakshi Backend is running!',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
  });
});

// API routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/cases', casesRoutes);
app.use('/documents', documentsRoutes); // Re-add documents routes
app.use('/notifications', notificationsRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/activity', activityRoutes);
app.use('/clients', clientRoutes);
app.use('/cases', hearingRoutes); // Hearings are nested under cases
app.use('/templates', templatesRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
