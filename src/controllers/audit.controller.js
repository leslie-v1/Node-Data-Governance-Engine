import prisma from '../prisma/prisma.client.js';

export async function index(req, res) {
  res.json({ message: 'Audit controller root (placeholder)' });
}

export async function listAudits(req, res) {
  // placeholder: return audits
  res.json({ audits: [] });
}

export default { index, listAudits };
