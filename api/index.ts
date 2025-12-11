// api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../dist/app.module';
import * as serverlessExpress from '@vendia/serverless-express';
import { Handler, APIGatewayEvent, Context } from 'aws-lambda';

let cachedServer: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress.default({ app: expressApp });
}

export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(event, context, () => {
    console.log('Callback called');
  });
};
