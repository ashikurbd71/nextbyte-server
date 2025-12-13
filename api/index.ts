import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getApp } from '../src/get-app';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // ✅ Preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const app = await getApp();
  const server = app.getHttpAdapter().getInstance(); // express

  return server(req, res);
}
