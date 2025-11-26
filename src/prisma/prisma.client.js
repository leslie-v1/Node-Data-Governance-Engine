import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { DATABASE_URL } from '../config/config.js';

// Create a connection pool
const pool = new Pool({ connectionString: DATABASE_URL });

// Create the PrismaPg adapter
const adapter = new PrismaPg(pool);

// Initialize the Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

export default prisma
