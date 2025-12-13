// api/index.ts (Revised)

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
// Removed Express imports and the need for require('express')
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define the whitelist globally for both local and Vercel environments
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://nextbyteitinstitute.com',
  'https://www.nextbyteitinstitute.com',
  'https://admin.nextbyteitinstitute.com',
  'https://nextbyteit.vercel.app', // Your primary Vercel app domain
  // Add any other specific, known production subdomains here
];

// Define a variable to hold the cached NestJS app instance
let cachedHandler: (req: VercelRequest, res: VercelResponse) => void;

// Function to create and prepare the NestJS serverless handler
async function bootstrapHandler() {
  // 1. Create the NestJS application
  const app = await NestFactory.create(
    AppModule,
    // Do NOT specify an adapter here; NestJS will use the default Express one internally
    { logger: ['error', 'warn'] }
  );

  // 2. Enable CORS with the same configuration as main.ts
  app.enableCors({
    origin: (origin, callback) => {
      // Log the incoming origin for debugging
      console.log(`CORS: Checking origin: ${origin || 'null/undefined'}`);

      // If no origin is provided (e.g., non-cross-origin request, same-origin, or mobile app), allow it
      if (!origin) {
        console.log('CORS: No origin provided, allowing request');
        return callback(null, true);
      }

      // Normalize origin by removing trailing slash
      const normalizedOrigin = origin.replace(/\/$/, '');

      // Check against the fixed whitelist (both original and normalized)
      if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes(normalizedOrigin)) {
        console.log(`CORS: Origin ${origin} is in whitelist, allowing`);
        return callback(null, true);
      }

      // Check for Vercel preview domains (e.g., https://app-git-branch-user.vercel.app)
      if (origin.endsWith('.vercel.app')) {
        console.log(`CORS: Origin ${origin} is a Vercel preview domain, allowing`);
        return callback(null, true);
      }

      // Log and reject any other origin
      console.error(`CORS: Origin ${origin} rejected. Allowed origins:`, ALLOWED_ORIGINS);
      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true, // Keep this if you use cookies or authorization headers
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // 3. Initialize the application (registers routes and middleware)
  await app.init();

  // 4. Extract the native HTTP listener function (the Express instance)
  const expressInstance = app.getHttpAdapter().getInstance();

  // 5. Return the handler function that Vercel needs
  return expressInstance;
}

// Helper function to check if origin is allowed
function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/$/, '');

  return (
    ALLOWED_ORIGINS.includes(origin) ||
    ALLOWED_ORIGINS.includes(normalizedOrigin) ||
    origin.endsWith('.vercel.app')
  );
}

// Helper function to get origin from request (with multiple fallbacks)
function getRequestOrigin(req: VercelRequest): string | undefined {
  // First try the Origin header (standard for CORS)
  let origin = req.headers.origin as string | undefined;

  console.log(`CORS Debug - Origin header: ${origin || 'missing'}`);
  console.log(`CORS Debug - Referer header: ${req.headers.referer || 'missing'}`);
  console.log(`CORS Debug - Host header: ${req.headers.host || 'missing'}`);
  console.log(`CORS Debug - X-Forwarded-Host: ${req.headers['x-forwarded-host'] || 'missing'}`);

  // If no Origin header, try Referer header as fallback
  if (!origin && req.headers.referer) {
    try {
      const refererUrl = new URL(req.headers.referer as string);
      const refererOrigin = refererUrl.origin;

      // Only use referer if it matches one of our allowed origins
      if (isOriginAllowed(refererOrigin)) {
        origin = refererOrigin;
        console.log(`CORS: Using Referer as origin fallback: ${origin}`);
      } else {
        console.log(`CORS: Referer origin ${refererOrigin} not in whitelist, ignoring`);
      }
    } catch (e) {
      console.log('CORS: Could not parse Referer header');
    }
  }

  // If still no origin, try to construct from Host header (for same-domain requests)
  if (!origin) {
    const host = (req.headers['x-forwarded-host'] || req.headers.host) as string | undefined;
    if (host) {
      // Check if this matches one of our allowed domains
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const potentialOrigin = `${protocol}://${host}`;

      // Check if this origin is in our whitelist
      if (ALLOWED_ORIGINS.some(allowed =>
        potentialOrigin === allowed ||
        potentialOrigin.replace(/\/$/, '') === allowed ||
        host.includes('nextbyteitinstitute.com') ||
        host.includes('nextbyteit.vercel.app')
      )) {
        origin = potentialOrigin;
        console.log(`CORS: Constructed origin from Host header: ${origin}`);
      }
    }
  }

  // Last resort: if we still don't have an origin but request seems to be from our domain,
  // allow it by returning undefined (which will trigger the wildcard fallback)
  if (!origin) {
    console.log('CORS: No origin detected, will use permissive CORS');
  }

  return origin;
}

// Helper function to set CORS headers
function setCorsHeaders(req: VercelRequest, res: VercelResponse): void {
  const origin = getRequestOrigin(req);

  // Always set CORS headers if origin is allowed OR if origin is null (permissive mode for our domains)
  const shouldAllow = isOriginAllowed(origin) || !origin;

  if (shouldAllow) {
    // When credentials is true, we must specify the exact origin, not '*'
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      console.log(`CORS: Set headers for origin: ${origin}`);
    } else {
      // If no origin detected, be permissive but check if request might be from our domain
      // Try to determine from other headers
      const host = (req.headers['x-forwarded-host'] || req.headers.host) as string | undefined;
      const isOurDomain = host && (
        host.includes('nextbyteitinstitute.com') ||
        host.includes('nextbyteit.vercel.app') ||
        host.includes('localhost')
      );

      // When origin is null, try to determine from Referer or Host headers
      // Default to www.nextbyteitinstitute.com as it's the main production domain
      let fallbackOrigin = 'https://www.nextbyteitinstitute.com';

      // Try Referer first (most reliable)
      if (req.headers.referer) {
        try {
          const refererUrl = new URL(req.headers.referer as string);
          const refererOrigin = refererUrl.origin;
          if (isOriginAllowed(refererOrigin)) {
            fallbackOrigin = refererOrigin;
            console.log(`CORS: Using Referer for fallback origin: ${fallbackOrigin}`);
          }
        } catch (e) {
          // Ignore
        }
      }

      // If Referer didn't work, try Host header
      if (fallbackOrigin === 'https://www.nextbyteitinstitute.com' && isOurDomain) {
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const hostname = host?.replace(/:\d+$/, ''); // Remove port

        // Try to find exact match
        const matchingOrigin = ALLOWED_ORIGINS.find(allowed => {
          const allowedHost = allowed.replace(/^https?:\/\//, '').replace(/^www\./, '');
          const requestHost = hostname?.replace(/^www\./, '');
          return allowedHost === requestHost;
        });

        if (matchingOrigin) {
          fallbackOrigin = matchingOrigin;
          console.log(`CORS: Using Host header for fallback origin: ${fallbackOrigin}`);
        }
      }

      // Set the determined origin with credentials
      res.setHeader('Access-Control-Allow-Origin', fallbackOrigin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      console.log(`CORS: Set headers for null origin fallback: ${fallbackOrigin}`);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  } else {
    console.error(`CORS: Origin ${origin} rejected. Allowed origins:`, ALLOWED_ORIGINS);
  }
}

// The main serverless function handler exported to Vercel
module.exports = async (req: VercelRequest, res: VercelResponse) => {
  // Set CORS headers for all requests (including OPTIONS preflight)
  setCorsHeaders(req, res);

  // Handle OPTIONS preflight requests immediately
  if (req.method === 'OPTIONS') {
    const origin = getRequestOrigin(req);
    if (isOriginAllowed(origin)) {
      return res.status(204).end();
    } else {
      return res.status(403).json({ error: 'CORS policy violation' });
    }
  }

  if (!cachedHandler) {
    // Initialize and cache the handler if it doesn't exist
    cachedHandler = await bootstrapHandler();
  }

  // Intercept writeHead to ensure CORS headers are always included
  const originalWriteHead = res.writeHead.bind(res);
  res.writeHead = function (statusCode: number, statusMessage?: any, headers?: any) {
    setCorsHeaders(req, res);
    if (typeof statusMessage === 'object') {
      headers = statusMessage;
      statusMessage = undefined;
    }
    return originalWriteHead(statusCode, statusMessage, headers);
  };

  // Intercept end to ensure CORS headers are set before response is sent
  const originalEnd = res.end.bind(res);
  res.end = function (chunk?: any, encoding?: any, cb?: any) {
    setCorsHeaders(req, res);
    return originalEnd(chunk, encoding, cb);
  };

  // Execute the cached Express handler function
  return cachedHandler(req, res);
};