import { config } from '@/config';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/chakshi_test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.SESSION_SECRET = 'test-session-secret';

// Setup test database connection and other test configurations
beforeAll(async () => {
  // Test setup logic here
});

afterAll(async () => {
  // Test cleanup logic here
});