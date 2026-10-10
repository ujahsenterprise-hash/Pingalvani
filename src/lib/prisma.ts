import 'dotenv/config';
import { PrismaClient } from '@prisma/client'; 
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (!globalForPrisma.prisma) {
  // 1. Create a connection pool using the string from your .env file
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // 2. Wrap it in Prisma's driver adapter
  const adapter = new PrismaPg(pool);
  
  // 3. Pass the adapter directly into the options object
  prismaInstance = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
} else {
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;