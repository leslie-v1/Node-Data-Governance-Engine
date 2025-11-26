import prisma from '../prisma/prisma.client.js'

export async function index(req, res) {
  res.json({ message: 'Request controller root (placeholder)' });
}

export async function createRequest(req, res) {
  // placeholder: create a data request
  res.status(201).json({ message: 'Request created (placeholder)' });
}

export default { index, createRequest };
