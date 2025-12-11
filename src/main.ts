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

// Vercel handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await bootstrap();
  app.getHttpAdapter().getInstance()(req, res);
}
