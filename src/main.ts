// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
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

// --- VERCEL HANDLER & CACHING LOGIC ---

// Cache the initialized NestJS application instance
let cachedApp: NestExpressApplication;

async function bootstrap(): Promise<NestExpressApplication> {
    if (!cachedApp) {
        // 1. Create the NestJS application
        const app = await NestFactory.create<NestExpressApplication>(AppModule, {
            logger: ['error', 'warn'], // Optimize logging for production
        });

        // 2. Implement the Dynamic CORS Function
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