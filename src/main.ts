// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedApp: NestExpressApplication;

async function bootstrap(): Promise<NestExpressApplication> {
  if (!cachedApp) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// Start server locally if not on Vercel
if (!process.env.VERCEL) {
  async function startLocalServer() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`🚀 Server is running on: http://localhost:${port}`);
  }
  startLocalServer();
}

// Vercel handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await bootstrap();
  app.getHttpAdapter().getInstance()(req, res);
}
