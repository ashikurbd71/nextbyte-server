import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

// Cache the initialized server across invocations to avoid cold-start cost.
let cachedServer: express.Express | null = null;

export default async function handler(req: Request, res: Response) {
  if (!cachedServer) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter);
    app.enableCors();
    await app.init();
    cachedServer = expressApp;
  }

  return cachedServer(req, res);
}
