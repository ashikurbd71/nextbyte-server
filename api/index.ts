import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://nextbyteitinstitute.com',
  'https://www.nextbyteitinstitute.com',
  'https://admin.nextbyteitinstitute.com',
  'https://nextbyteit.vercel.app',
];

let cachedHandler: any;

async function bootstrapHandler() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
  await app.init();
  return app.getHttpAdapter().getInstance(); // Express instance
}

function getRequestOrigin(req: VercelRequest): string | undefined {
  let origin = req.headers.origin as string | undefined;
  if (!origin && req.headers.referer) {
    try {
      origin = new URL(req.headers.referer).origin;
    } catch { }
  }
  return origin;
}

function isOriginAllowed(origin?: string): boolean {
  if (!origin) return true;
  const normalized = origin.replace(/\/$/, '');
  return ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes(normalized) || origin.endsWith('.vercel.app');
}

function setCorsHeaders(req: VercelRequest, res: VercelResponse) {
  const origin = getRequestOrigin(req);
  if (isOriginAllowed(origin)) {
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (!cachedHandler) {
    cachedHandler = await bootstrapHandler();
  }

  return cachedHandler(req, res);
};
