import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common';

dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
  });
  const port = process.env.PORT || 7000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}

bootstrap();
