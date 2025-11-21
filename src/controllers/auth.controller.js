import prisma from '../config/db.js';

export async function index(req, res) {
  res.json({ message: 'Auth controller root (placeholder)' });
}

export async function register(req, res) {
  // placeholder: implement registration with Prisma later
  res.status(201).json({ message: 'User registered (placeholder)' });
}

export async function login(req, res) {
  // placeholder: implement login with Prisma later
  res.json({ message: 'User logged in (placeholder)' });
}

export default { index, register, login };
