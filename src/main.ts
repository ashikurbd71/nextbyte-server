// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { VercelRequest, VercelResponse } from '@vercel/node';



// Cache the initialized NestJS application instance
let cachedApp: NestExpressApplication;

async function bootstrap(): Promise<NestExpressApplication> {
    if (!cachedApp) {
        // 1. Create the NestJS application
        const app = await NestFactory.create<NestExpressApplication>(AppModule, {
            logger: ['error', 'warn'], // Optimize logging for production
        });

  app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://nextbyteitinstitute.com',
      'https://www.nextbyteitinstitute.com',
      'https://admin.nextbyteitinstitute.com',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

        // 3. Initialize the app to finalize middleware and routing
        await app.init();
        cachedApp = app;
    }
    return cachedApp;
}

// --- LOCAL SERVER START (For Development) ---

// Start server locally if not on Vercel
if (!process.env.VERCEL) {
    async function startLocalServer() {
        // Re-use the bootstrap logic for consistency, but start listening
        const app = await bootstrap(); 
        const port = process.env.PORT || 5000;
        await app.listen(port);
        console.log(`🚀 Server is running on: http://localhost:${port}`);
    }
    startLocalServer();
}

// --- VERCEL ENTRY POINT ---

// Vercel handler function
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Get the cached application instance
    const app = await bootstrap();

    // Extract the native Express handler and execute the request
    app.getHttpAdapter().getInstance()(req, res);
}