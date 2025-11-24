// src/config/index.js

// 1. Import the dotenv package
import dotenv, { config } from 'dotenv';

// 2. Load environment variables from the .env file.
// If you are deploying, the host environment (like Heroku or Vercel)
// handles this, but for local dev, this line is crucial.
dotenv.config(); 

// 3. Export configuration variables
// Use process.env to access variables, and provide default values
// (like || 3000) for safety in case the .env file is missing a key.
export const PORT = process.env.PORT || 3000;

export const DATABASE_URL = process.env.DATABASE_URL;

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3d';

export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASS = process.env.MAIL_PASS;

export default config