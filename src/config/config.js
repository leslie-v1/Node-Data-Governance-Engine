// src/config/index.js

// 1. Import the dotenv package
import dotenv from 'dotenv';

// 2. Load environment variables from the .env file.
// If you are deploying, the host environment (like Heroku or Vercel)
// handles this, but for local dev, this line is crucial.
dotenv.config(); 

// 3. Export configuration variables
// Use process.env to access variables, and provide default values
// (like || 3000) for safety in case the .env file is missing a key.
const config = {
    // Application
    PORT: process.env.PORT || 3000,
    
    // Database (Prisma automatically uses DATABASE_URL, but we list it for context)
    DATABASE_URL: process.env.DATABASE_URL, 

    // Security
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '3d', // 3 days by default

    // Email (Nodemailer setup)
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
};

export default config;