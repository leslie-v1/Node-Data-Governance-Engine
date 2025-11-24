import prisma from '../models/prisma/prisma.client.js';

export async function index(req, res) {
  res.json({ message: 'Data controller root (placeholder)' });
}

export async function listVaults(req, res) {
  // placeholder: return list of data vaults
  res.json({ data: [] });
}

export default { index, listVaults };
