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
      // If no origin is provided (e.g., non-cross-origin request), allow it
      if (!origin) {
        return callback(null, true);
      }

      // Check against the fixed whitelist
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      // Check for Vercel preview domains (e.g., https://app-git-branch-user.vercel.app)
      if (origin.endsWith('.vercel.app')) {
        // You can add stricter checks here if needed, but this allows all Vercel previews.
        return callback(null, true);
      }

      // Log and reject any other origin
      console.error(`CORS: Origin ${origin} rejected.`);
      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Keep this if you use cookies or authorization headers
  });

  // 3. Initialize the application (registers routes and middleware)
  await app.init();

  // 4. Extract the native HTTP listener function (the Express instance)
  const expressInstance = app.getHttpAdapter().getInstance();

  // 5. Return the handler function that Vercel needs
  return expressInstance;
}

// The main serverless function handler exported to Vercel
module.exports = async (req: VercelRequest, res: VercelResponse) => {
  if (!cachedHandler) {
    // Initialize and cache the handler if it doesn't exist
    cachedHandler = await bootstrapHandler();
  }

  // Execute the cached Express handler function
  return cachedHandler(req, res);
};