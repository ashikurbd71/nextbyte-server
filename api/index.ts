import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Base allowed origins
const BASE_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://nextbyteitinstitute.com',
  'https://www.nextbyteitinstitute.com',
  'https://admin.nextbyteitinstitute.com',
  'https://nextbyteit.vercel.app',
];

// Add additional origins from environment variable (comma-separated)
const ADDITIONAL_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
  : [];

// Combine all allowed origins
const ALLOWED_ORIGINS = [...BASE_ALLOWED_ORIGINS, ...ADDITIONAL_ORIGINS];

let cachedHandler: any;

async function bootstrapHandler() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });

  // Enable CORS with credentials support
  app.enableCors({
    origin: (origin, callback) => {
      // Log for debugging in production
      console.log(`[CORS] Checking origin: ${origin || 'null/undefined'}`);

      if (!origin) {
        console.log('[CORS] No origin provided, allowing request');
        return callback(null, true);
      }

      const normalized = origin.replace(/\/$/, '');
      const isAllowed =
        ALLOWED_ORIGINS.includes(origin) ||
        ALLOWED_ORIGINS.includes(normalized) ||
        origin.endsWith('.vercel.app');

      if (isAllowed) {
        console.log(`[CORS] Origin ${origin} is allowed`);
        return callback(null, true);
      }

      console.error(`[CORS] Origin ${origin} rejected. Allowed origins:`, ALLOWED_ORIGINS);
      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

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
  console.log(`[CORS Headers] Setting headers for origin: ${origin || 'null'}`);

  if (isOriginAllowed(origin)) {
    // When credentials is true, we must specify the exact origin, not '*'
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      console.log(`[CORS Headers] Set origin to: ${origin} with credentials`);
    } else {
      // If no origin, use a default allowed origin (first in list) or skip wildcard with credentials
      // For credentials to work, we need a specific origin
      const fallbackOrigin = ALLOWED_ORIGINS[0] || '*';
      res.setHeader('Access-Control-Allow-Origin', fallbackOrigin);
      console.log(`[CORS Headers] No origin, using fallback: ${fallbackOrigin}`);
      // Don't set credentials when using fallback
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  } else {
    console.error(`[CORS Headers] Origin ${origin} is not allowed`);
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  // Set CORS headers FIRST before any processing
  setCorsHeaders(req, res);

  // Handle OPTIONS preflight requests immediately
  if (req.method === 'OPTIONS') {
    const origin = getRequestOrigin(req);
    if (isOriginAllowed(origin)) {
      console.log(`[OPTIONS] Preflight request allowed for origin: ${origin}`);
      return res.status(204).end();
    } else {
      console.error(`[OPTIONS] Preflight request rejected for origin: ${origin}`);
      return res.status(403).json({ error: 'CORS policy violation' });
    }
  }

  // Initialize handler if not cached
  if (!cachedHandler) {
    console.log('[Handler] Initializing NestJS handler...');
    cachedHandler = await bootstrapHandler();
  }

  // Intercept response methods to ensure CORS headers are always set
  const originalWriteHead = res.writeHead.bind(res);
  res.writeHead = function (statusCode: number, statusMessage?: any, headers?: any) {
    setCorsHeaders(req, res);
    if (typeof statusMessage === 'object') {
      headers = statusMessage;
      statusMessage = undefined;
    }
    return originalWriteHead(statusCode, statusMessage, headers);
  };

  const originalEnd = res.end.bind(res);
  res.end = function (chunk?: any, encoding?: any, cb?: any) {
    setCorsHeaders(req, res);
    return originalEnd(chunk, encoding, cb);
  };

  // Execute the cached Express handler
  return cachedHandler(req, res);
};
