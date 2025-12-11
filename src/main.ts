import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createServer, proxy } from 'aws-serverless-express';

const expressApp = express();
const adapter = new ExpressAdapter(expressApp);

const appPromise = NestFactory.create<NestExpressApplication>(AppModule, adapter)
  .then(app => {
    app.enableCors(); // Enable CORS
    return app.init();
  });

// Exported handler for Vercel
export const handler = async (req, res) => {
  const app = await appPromise;
  proxy(createServer(app), req, res);
};
