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

  
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  
  const frontendPath = join(__dirname, '../../../frontend/dist');
  app.use(express.static(frontendPath));

  
  app.get('*', (_, res) => {
    res.sendFile(join(frontendPath, 'index.html'));
  });

  const port = process.env.PORT || 7000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}

bootstrap();
