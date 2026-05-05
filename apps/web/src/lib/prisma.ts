import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Build-safe database initialization
const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL;
const isReady = !!connectionString && !connectionString.includes('your-');

let prismaInstance: PrismaClient;

if (!isReady) {
  console.warn('[Prisma] Missing or placeholder database URL. Using Proxy mock for build safety.');
  // Recursive proxy that returns itself or a mock function to prevent build-time crashes
  const createMock = () => {
    const mock: any = new Proxy(() => {}, {
      get: (target, prop) => {
        if (prop === 'then') return undefined; // Handle promises
        return mock;
      },
      apply: () => Promise.resolve(null)
    });
    return mock;
  };
  prismaInstance = createMock();
} else {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prismaInstance = globalForPrisma.prisma || new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;


