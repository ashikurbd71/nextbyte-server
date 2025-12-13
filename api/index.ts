// api/index.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module'; // Adjust path if necessary
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define a variable to hold the cached NestJS app instance
let cachedNestApp: any;

// The main serverless function handler
module.exports = async (req: VercelRequest, res: VercelResponse) => {
  if (!cachedNestApp) {
    // 1. Create a standard Express server instance
    const server = express();
    
    // 2. Create the NestJS app using the Express adapter
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      { logger: ['error', 'warn'] } // Recommended for production
    );

    // 3. Initialize the application and close the server connection (important for Vercel)
    await nestApp.init();

    // 4. Cache the initialized app for subsequent hot requests
    cachedNestApp = server;
  }
  
  // 5. Send the request to the cached Express app instance
  // The 'cachedNestApp' (which is the Express instance) is what handles the request
  return cachedNestApp(req, res);
};