import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Handler } from '@vercel/node';

let appInstance: any;

async function bootstrap() {
  if (!appInstance) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init(); // serverless environment এর জন্য listen এর পরিবর্তে init ব্যবহার
    appInstance = app;
  }
  return appInstance;
}

// Vercel-compatible handler
const handler: Handler = async (req, res) => {
  const app = await bootstrap();
  app.getHttpAdapter().getInstance()(req, res);
};

export default handler;
