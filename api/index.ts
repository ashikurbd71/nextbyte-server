// api/index.ts (Revised)

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
// Removed Express imports and the need for require('express')
import type { VercelRequest, VercelResponse } from '@vercel/node';

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
  
  // 2. Initialize the application (registers routes and middleware)
  await app.init();

  // 3. Extract the native HTTP listener function (the Express instance)
  const expressInstance = app.getHttpAdapter().getInstance();
  
  // 4. Return the handler function that Vercel needs
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