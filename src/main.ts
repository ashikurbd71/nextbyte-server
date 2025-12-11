import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  try {
    console.log("🚀 Starting NestJS application...");

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Enable CORS
    app.enableCors();

    const port = process.env.PORT ?? 5000;

    await app.listen(port);

    console.log(`✅ Server is running on port ${port}`);
  } catch (error) {
    console.error("❌ Bootstrap error:", error);
    // rethrow so vercel shows fail instead of silent timeout
    throw error;
  }
}

bootstrap();
