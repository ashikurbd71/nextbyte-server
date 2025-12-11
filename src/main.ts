import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { VercelRequest, VercelResponse } from '@vercel/node';

let cachedApp: NestExpressApplication;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    cachedApp = app;
  }
  return cachedApp;
}

// Vercel handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await bootstrap();
  app.getHttpAdapter().getInstance()(req, res);
}
