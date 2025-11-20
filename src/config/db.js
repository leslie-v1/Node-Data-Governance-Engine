// src/config/db.js

import { PrismaClient } from '@prisma/client';

// Initialize the Prisma Client
const prisma = new PrismaClient();


export default {
    prisma,
};