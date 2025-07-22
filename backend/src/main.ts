import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // CORS for dev
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  // Serve frontend build
  const frontendPath = join(__dirname, '../frontend');
  app.useStaticAssets(frontendPath);
  app.use(express.static(frontendPath));

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('*', (req, res) => {
    res.sendFile(join(frontendPath, 'index.html'));
  });

  const port = process.env.PORT || 7000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}

bootstrap();
