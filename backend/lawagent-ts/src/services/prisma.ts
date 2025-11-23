import { PrismaClient } from '@prisma/client';
import { config } from '@/config';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Singleton pattern for Prisma client to avoid connection issues
export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log: config.server.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: config.database.url,
      },
    },
  });

if (config.server.nodeEnv !== 'production') {
  globalThis.__prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});